import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, of, shareReplay, switchMap, tap } from 'rxjs';
import { STATIC_SEED_DATA_BASE_URL } from '../api/api.config';
import {
  Evaluation,
  Feedback,
  Goal,
  LoginRequest,
  LoginResponse,
  ManagerDashboard,
  MemberDashboard,
  MemberProfile,
  OneToOneNote,
  Team,
  User
} from '../models/team-pulse.models';
import { StorageService } from '../storage/storage.service';

interface SeedUser extends User {
  password: string;
}

interface SeedMetadata {
  seedVersion: string;
}

interface SeedCollections {
  users: SeedUser[];
  teams: Team[];
  members: MemberProfile[];
  evaluations: Evaluation[];
  goals: Goal[];
  feedback: Feedback[];
  notes: OneToOneNote[];
}

type CollectionName = keyof SeedCollections;

const STORAGE_PREFIX = 'teampulse.v2';
const SEED_VERSION_KEY = `${STORAGE_PREFIX}.seedVersion`;
const COLLECTION_KEYS: Record<CollectionName, string> = {
  users: `${STORAGE_PREFIX}.users`,
  teams: `${STORAGE_PREFIX}.teams`,
  members: `${STORAGE_PREFIX}.members`,
  evaluations: `${STORAGE_PREFIX}.evaluations`,
  goals: `${STORAGE_PREFIX}.goals`,
  feedback: `${STORAGE_PREFIX}.feedback`,
  notes: `${STORAGE_PREFIX}.notes`
};

@Injectable({ providedIn: 'root' })
export class StaticDataStore {
  private readonly http = inject(HttpClient);
  private readonly seedDataBaseUrl = inject(STATIC_SEED_DATA_BASE_URL);
  private readonly storage = inject(StorageService);
  private initialized = false;
  private initialization$?: Observable<void>;

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.ensureInitialized().pipe(
      map(() => {
        const user = this.readCollection('users').find(
          (candidate) => candidate.email.toLowerCase() === request.email.toLowerCase() && candidate.password === request.password
        );

        if (!user) {
          throw new Error('Invalid demo credentials.');
        }

        return this.toSession(user);
      })
    );
  }

  getUsers(): Observable<User[]> {
    return this.withState(() => this.readCollection('users').map((user) => this.toPublicUser(user)));
  }

  getUser(id: number): Observable<User> {
    return this.withState(() => this.requireItem(this.readCollection('users').map((user) => this.toPublicUser(user)), id, 'user'));
  }

  getTeams(): Observable<Team[]> {
    return this.withState(() => this.readCollection('teams'));
  }

  getTeam(id: number): Observable<Team> {
    return this.withState(() => this.requireItem(this.readCollection('teams'), id, 'team'));
  }

  createTeam(team: Team): Observable<Team> {
    return this.withState(() => this.addItem('teams', team));
  }

  updateTeam(id: number, team: Team): Observable<Team> {
    return this.withState(() => this.updateItem('teams', id, team));
  }

  deleteTeam(id: number): Observable<void> {
    return this.withState(() => this.deleteItem('teams', id));
  }

  getMembers(): Observable<MemberProfile[]> {
    return this.withState(() => this.readCollection('members'));
  }

  getMember(id: number): Observable<MemberProfile> {
    return this.withState(() => this.requireItem(this.readCollection('members'), id, 'member'));
  }

  getTeamMembers(teamId: number): Observable<MemberProfile[]> {
    return this.withState(() => this.readCollection('members').filter((member) => member.teamId === teamId));
  }

  createMember(member: MemberProfile): Observable<MemberProfile> {
    return this.withState(() => this.addItem('members', member));
  }

  updateMember(id: number, member: MemberProfile): Observable<MemberProfile> {
    return this.withState(() => this.updateItem('members', id, member));
  }

  deleteMember(id: number): Observable<void> {
    return this.withState(() => this.deleteItem('members', id));
  }

  getEvaluations(): Observable<Evaluation[]> {
    return this.withState(() => this.readCollection('evaluations'));
  }

  getMemberEvaluations(memberId: number): Observable<Evaluation[]> {
    return this.withState(() => this.readCollection('evaluations').filter((evaluation) => evaluation.memberId === memberId));
  }

  createEvaluation(evaluation: Evaluation): Observable<Evaluation> {
    return this.withState(() =>
      this.addItem('evaluations', {
        ...evaluation,
        createdAt: evaluation.createdAt || new Date().toISOString()
      })
    );
  }

  updateEvaluation(id: number, evaluation: Evaluation): Observable<Evaluation> {
    return this.withState(() => this.updateItem('evaluations', id, evaluation));
  }

  deleteEvaluation(id: number): Observable<void> {
    return this.withState(() => this.deleteItem('evaluations', id));
  }

  getGoals(): Observable<Goal[]> {
    return this.withState(() => this.readCollection('goals'));
  }

  getMemberGoals(memberId: number): Observable<Goal[]> {
    return this.withState(() => this.readCollection('goals').filter((goal) => goal.ownerType === 'Member' && goal.ownerId === memberId));
  }

  getTeamGoals(teamId: number): Observable<Goal[]> {
    return this.withState(() => this.readCollection('goals').filter((goal) => goal.ownerType === 'Team' && goal.ownerId === teamId));
  }

  createGoal(goal: Goal): Observable<Goal> {
    return this.withState(() => this.addItem('goals', goal));
  }

  updateGoal(id: number, goal: Goal): Observable<Goal> {
    return this.withState(() => this.updateItem('goals', id, goal));
  }

  deleteGoal(id: number): Observable<void> {
    return this.withState(() => this.deleteItem('goals', id));
  }

  getFeedback(): Observable<Feedback[]> {
    return this.withState(() => this.readCollection('feedback'));
  }

  getMemberFeedback(memberId: number): Observable<Feedback[]> {
    return this.withState(() =>
      this.readCollection('feedback')
        .filter((feedback) => feedback.memberId === memberId)
        .sort((left, right) => this.compareDescending(left.createdAt, right.createdAt))
    );
  }

  createFeedback(feedback: Feedback): Observable<Feedback> {
    return this.withState(() =>
      this.addItem('feedback', {
        ...feedback,
        createdAt: feedback.createdAt || new Date().toISOString()
      })
    );
  }

  deleteFeedback(id: number): Observable<void> {
    return this.withState(() => this.deleteItem('feedback', id));
  }

  getMemberNotes(memberId: number): Observable<OneToOneNote[]> {
    return this.withState(() =>
      this.readCollection('notes')
        .filter((note) => note.memberId === memberId)
        .sort((left, right) => this.compareDescending(left.createdAt, right.createdAt))
    );
  }

  createNote(note: OneToOneNote): Observable<OneToOneNote> {
    return this.withState(() =>
      this.addItem('notes', {
        ...note,
        createdAt: note.createdAt || new Date().toISOString()
      })
    );
  }

  deleteNote(id: number): Observable<void> {
    return this.withState(() => this.deleteItem('notes', id));
  }

  getManagerDashboard(): Observable<ManagerDashboard> {
    return this.withState(() => {
      const teams = this.readCollection('teams');
      const members = this.readCollection('members');
      const goals = this.readCollection('goals');
      const feedback = this.readCollection('feedback');

      return {
        teamCount: teams.length,
        memberCount: members.length,
        averageHealthScore: this.average(teams.map((team) => team.healthScore)),
        averageDeliveryScore: this.average(teams.map((team) => team.deliveryScore)),
        averageEngagementScore: this.average(teams.map((team) => team.engagementScore)),
        highRiskMemberCount: members.filter((member) => member.riskLevel === 'High').length,
        teams,
        upcomingGoals: goals.sort((left, right) => left.dueDate.localeCompare(right.dueDate)).slice(0, 8),
        recentFeedback: feedback.sort((left, right) => this.compareDescending(left.createdAt, right.createdAt)).slice(0, 8)
      };
    });
  }

  getMemberDashboard(userId: number): Observable<MemberDashboard> {
    return this.withState(() => {
      const user = this.requireItem(this.readCollection('users').map((item) => this.toPublicUser(item)), userId, 'user');
      const profile = this.readCollection('members').find((member) => member.userId === userId) ?? null;
      const team = profile ? (this.readCollection('teams').find((item) => item.id === profile.teamId) ?? null) : null;
      const latestEvaluation = profile
        ? (this.readCollection('evaluations')
            .filter((evaluation) => evaluation.memberId === profile.id)
            .sort((left, right) => this.compareDescending(left.createdAt, right.createdAt))[0] ?? null)
        : null;

      return {
        user,
        profile,
        team,
        latestEvaluation,
        goals: profile ? this.readCollection('goals').filter((goal) => goal.ownerType === 'Member' && goal.ownerId === profile.id) : [],
        recentFeedback: profile
          ? this.readCollection('feedback')
              .filter((feedback) => feedback.memberId === profile.id)
              .sort((left, right) => this.compareDescending(left.createdAt, right.createdAt))
              .slice(0, 8)
          : [],
        notes: profile
          ? this.readCollection('notes')
              .filter((note) => note.memberId === profile.id)
              .sort((left, right) => this.compareDescending(left.createdAt, right.createdAt))
              .slice(0, 8)
          : []
      };
    });
  }

  private withState<T>(factory: () => T): Observable<T> {
    return this.ensureInitialized().pipe(map(() => this.clone(factory())));
  }

  private ensureInitialized(): Observable<void> {
    if (this.initialized) {
      return of(undefined);
    }

    this.initialization$ ??= this.loadMetadata().pipe(
      switchMap((metadata) => {
        const currentVersion = this.storage.get<string>(SEED_VERSION_KEY);
        if (currentVersion === metadata.seedVersion && this.hasAllCollections()) {
          return of(undefined);
        }

        // Learning Lab: shared JSON seed data + static setup
        // GitHub Pages builds load the same seed JSON files as the backend, then persist them in namespaced localStorage keys.
        return this.loadSeedCollections().pipe(
          tap((collections) => {
            this.writeCollection('users', collections.users);
            this.writeCollection('teams', collections.teams);
            this.writeCollection('members', collections.members);
            this.writeCollection('evaluations', collections.evaluations);
            this.writeCollection('goals', collections.goals);
            this.writeCollection('feedback', collections.feedback);
            this.writeCollection('notes', collections.notes);
            this.storage.set(SEED_VERSION_KEY, metadata.seedVersion);
          }),
          map(() => undefined)
        );
      }),
      tap(() => {
        this.initialized = true;
      }),
      shareReplay(1)
    );

    return this.initialization$;
  }

  private loadMetadata(): Observable<SeedMetadata> {
    return this.getSeedFile<SeedMetadata>('seed-metadata.json');
  }

  private loadSeedCollections(): Observable<SeedCollections> {
    // Learning Lab: RxJS forkJoin()
    // All seed files load in parallel; the store initializes only after every collection has arrived.
    return forkJoin({
      users: this.getSeedFile<SeedUser[]>('users.json'),
      teams: this.getSeedFile<Team[]>('teams.json'),
      members: this.getSeedFile<MemberProfile[]>('members.json'),
      evaluations: this.getSeedFile<Evaluation[]>('evaluations.json'),
      goals: this.getSeedFile<Goal[]>('goals.json'),
      feedback: this.getSeedFile<Feedback[]>('feedback.json'),
      notes: this.getSeedFile<OneToOneNote[]>('notes.json')
    });
  }

  private getSeedFile<T>(fileName: string): Observable<T> {
    const baseUrl = this.seedDataBaseUrl.replace(/\/$/, '');
    return this.http.get<T>(`${baseUrl}/${fileName}`);
  }

  private hasAllCollections(): boolean {
    return (Object.keys(COLLECTION_KEYS) as CollectionName[]).every((name) => Array.isArray(this.storage.get<unknown[]>(COLLECTION_KEYS[name])));
  }

  private readCollection<TName extends CollectionName>(name: TName): SeedCollections[TName] {
    const collection = this.storage.get<SeedCollections[TName]>(COLLECTION_KEYS[name]);
    if (!Array.isArray(collection)) {
      throw new Error(`Static TeamPulse data is not initialized for ${name}.`);
    }

    return this.clone(collection);
  }

  private writeCollection<TName extends CollectionName>(name: TName, collection: SeedCollections[TName]): void {
    this.storage.set(COLLECTION_KEYS[name], this.clone(collection));
  }

  private addItem<TName extends CollectionName>(name: TName, item: SeedCollections[TName][number]): SeedCollections[TName][number] {
    const collection = this.readCollection(name) as Array<SeedCollections[TName][number]>;
    const created = { ...item, id: this.nextId(collection) } as SeedCollections[TName][number];
    collection.push(created);
    this.writeCollection(name, collection as SeedCollections[TName]);
    return created;
  }

  private updateItem<TName extends CollectionName>(
    name: TName,
    id: number,
    item: SeedCollections[TName][number]
  ): SeedCollections[TName][number] {
    const collection = this.readCollection(name) as Array<SeedCollections[TName][number]>;
    const index = collection.findIndex((candidate) => candidate.id === id);
    if (index < 0) {
      throw new Error(`Cannot update missing ${name} item ${id}.`);
    }

    const updated = { ...item, id } as SeedCollections[TName][number];
    collection[index] = updated;
    this.writeCollection(name, collection as SeedCollections[TName]);
    return updated;
  }

  private deleteItem<TName extends CollectionName>(name: TName, id: number): void {
    const collection = this.readCollection(name);
    this.writeCollection(
      name,
      collection.filter((candidate) => candidate.id !== id) as SeedCollections[TName]
    );
  }

  private requireItem<T extends { id: number }>(items: T[], id: number, label: string): T {
    const item = items.find((candidate) => candidate.id === id);
    if (!item) {
      throw new Error(`Cannot find ${label} ${id}.`);
    }

    return item;
  }

  private nextId(items: Array<{ id: number }>): number {
    return items.length === 0 ? 1 : Math.max(...items.map((item) => item.id)) + 1;
  }

  private toSession(user: SeedUser): LoginResponse {
    return {
      userId: user.id,
      fullName: user.fullName,
      email: user.email,
      appRole: user.appRole,
      businessTitle: user.businessTitle,
      teamId: user.teamId
    };
  }

  private toPublicUser(user: SeedUser): User {
    const { password: _password, ...publicUser } = user;
    return publicUser;
  }

  private average(values: number[]): number {
    return values.length === 0 ? 0 : Math.round(values.reduce((total, value) => total + value, 0) / values.length);
  }

  private compareDescending(left: string, right: string): number {
    return right.localeCompare(left);
  }

  private clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
  }
}
