export type AppRole = 'Manager' | 'TeamMember';
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type Seniority = 'Junior' | 'Mid' | 'Senior' | 'Lead';
export type OwnerType = 'Team' | 'Member';
export type GoalStatus = 'NotStarted' | 'InProgress' | 'Blocked' | 'Completed';
export type FeedbackType = 'Recognition' | 'Improvement' | 'Risk' | 'General';

export interface User {
  id: number;
  fullName: string;
  email: string;
  appRole: AppRole;
  businessTitle: string;
  teamId: number | null;
  avatarUrl?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  fullName: string;
  email: string;
  appRole: AppRole;
  businessTitle: string;
  teamId: number | null;
}

export interface Team {
  id: number;
  name: string;
  mission: string;
  managerId: number;
  healthScore: number;
  deliveryScore: number;
  engagementScore: number;
  riskLevel: RiskLevel;
}

export interface MemberProfile {
  id: number;
  userId: number;
  fullName: string;
  role: string;
  seniority: Seniority;
  teamId: number;
  skills: string[];
  performanceScore: number;
  engagementScore: number;
  riskLevel: RiskLevel;
}

export interface Evaluation {
  id: number;
  memberId: number;
  period: string;
  technicalScore: number;
  communicationScore: number;
  ownershipScore: number;
  teamworkScore: number;
  deliveryScore: number;
  comments: string;
  createdAt: string;
}

export interface Goal {
  id: number;
  title: string;
  description: string;
  ownerType: OwnerType;
  ownerId: number;
  progress: number;
  status: GoalStatus;
  dueDate: string;
}

export interface Feedback {
  id: number;
  memberId: number;
  fromUserId: number;
  type: FeedbackType;
  message: string;
  createdAt: string;
}

export interface OneToOneNote {
  id: number;
  memberId: number;
  managerId: number;
  note: string;
  createdAt: string;
}

export interface ManagerDashboard {
  teamCount: number;
  memberCount: number;
  averageHealthScore: number;
  averageDeliveryScore: number;
  averageEngagementScore: number;
  highRiskMemberCount: number;
  teams: Team[];
  upcomingGoals: Goal[];
  recentFeedback: Feedback[];
}

export interface MemberDashboard {
  user: User;
  profile: MemberProfile | null;
  team: Team | null;
  latestEvaluation: Evaluation | null;
  goals: Goal[];
  recentFeedback: Feedback[];
  notes: OneToOneNote[];
}
