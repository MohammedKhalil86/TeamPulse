import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login-page.component').then((m) => m.LoginPageComponent),
    title: 'Login | TeamPulse'
  },
  {
    path: '',
    loadComponent: () => import('./core/layout/app-layout.component').then((m) => m.AppLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard-page.component').then((m) => m.DashboardPageComponent),
        title: 'Dashboard | TeamPulse'
      },
      {
        path: 'teams',
        canActivate: [roleGuard],
        data: { roles: ['Manager', 'TeamMember'] },
        loadComponent: () => import('./features/teams/teams-page.component').then((m) => m.TeamsPageComponent),
        title: 'Teams | TeamPulse'
      },
      {
        path: 'teams/:id',
        canActivate: [roleGuard],
        data: { roles: ['Manager', 'TeamMember'] },
        loadComponent: () => import('./features/teams/team-detail-page.component').then((m) => m.TeamDetailPageComponent),
        title: 'Team Detail | TeamPulse'
      },
      {
        path: 'members',
        canActivate: [roleGuard],
        data: { roles: ['Manager', 'TeamMember'] },
        loadComponent: () => import('./features/members/members-page.component').then((m) => m.MembersPageComponent),
        title: 'Members | TeamPulse'
      },
      {
        path: 'members/:id',
        canActivate: [roleGuard],
        data: { roles: ['Manager', 'TeamMember'] },
        loadComponent: () => import('./features/members/member-detail-page.component').then((m) => m.MemberDetailPageComponent),
        title: 'Member Detail | TeamPulse'
      },
      {
        path: 'evaluations',
        canActivate: [roleGuard],
        data: { roles: ['Manager', 'TeamMember'] },
        loadComponent: () =>
          import('./features/evaluations/evaluations-page.component').then((m) => m.EvaluationsPageComponent),
        title: 'Evaluations | TeamPulse'
      },
      {
        path: 'feedback',
        canActivate: [roleGuard],
        data: { roles: ['Manager', 'TeamMember'] },
        loadComponent: () => import('./features/feedback/feedback-page.component').then((m) => m.FeedbackPageComponent),
        title: 'Feedback | TeamPulse'
      },
      {
        path: 'goals',
        canActivate: [roleGuard],
        data: { roles: ['Manager', 'TeamMember'] },
        loadComponent: () => import('./features/goals/goals-page.component').then((m) => m.GoalsPageComponent),
        title: 'Goals | TeamPulse'
      },
      {
        path: 'how-teampulse-works',
        canActivate: [roleGuard],
        data: { roles: ['Manager', 'TeamMember'] },
        loadComponent: () =>
          import('./features/how-teampulse-works/how-teampulse-works-page.component').then(
            (m) => m.HowTeamPulseWorksPageComponent
          ),
        title: 'How TeamPulse Works | TeamPulse'
      },
      {
        path: 'angular-lab',
        loadComponent: () =>
          import('./features/angular-lab/angular-lab-page.component').then((m) => m.AngularLabPageComponent),
        title: 'Angular Lab | TeamPulse'
      },
      {
        path: 'angular-lab/:featureId',
        loadComponent: () =>
          import('./features/angular-lab/angular-lab-detail-page.component').then((m) => m.AngularLabDetailPageComponent),
        title: 'Angular Lab Detail | TeamPulse'
      }
    ]
  },
  {
    path: 'not-found',
    loadComponent: () => import('./features/not-found/not-found-page.component').then((m) => m.NotFoundPageComponent),
    title: 'Not Found | TeamPulse'
  },
  { path: '**', redirectTo: 'not-found' }
];
