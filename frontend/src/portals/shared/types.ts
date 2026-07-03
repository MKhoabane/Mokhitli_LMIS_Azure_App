import type { ComponentType } from 'react';

export interface DashboardLearner {
  id: number;
  name: string;
  email: string;
  status: string;
  course: string;
}

export interface DashboardCourse {
  id: number;
  code: string;
  title: string;
  saqaId: string;
  enrollment: number;
  passRate: string;
}

export interface DashboardSubmission {
  id: number;
  saqaId: string;
  qualificationType: string;
  submittedAt: string;
}

export interface RegisteredModule {
  id: string;
  name: string;
  basePath: string;
  aliases?: string[];
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  defaultPortal: string;
  companyId?: string;
  companyName?: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface DashboardData {
  learners: DashboardLearner[];
  courses: DashboardCourse[];
  recentSubmissions: DashboardSubmission[];
  infrastructure: Record<string, string>;
  modules: RegisteredModule[];
}

export interface LearnerPortalData {
  learner: {
    id: string;
    name: string;
    programme: string;
    nqfLevel: number;
    facilitator: string;
  };
  progress: Array<{
    title: string;
    completion: number;
  }>;
  upcomingAssessments: Array<{
    title: string;
    dueDate: string;
    type: string;
  }>;
  certificates: Array<{
    title: string;
    status: string;
  }>;
}

export interface FacilitatorPortalData {
  facilitator: {
    name: string;
    activeCohorts: number;
    assignedLearners: number;
  };
  sessions: Array<{
    cohort: string;
    module: string;
    date: string;
    attendance: number;
  }>;
  cohorts: Array<{
    name: string;
    completion: number;
    atRisk: number;
  }>;
  actions: string[];
}

export interface AssessorPortalData {
  assessor: {
    name: string;
    openAssessments: number;
    dueThisWeek: number;
  };
  queue: Array<{
    learner: string;
    assessment: string;
    dueDate: string;
    status: string;
  }>;
  outcomes: Array<{
    programme: string;
    competent: number;
    reAssessments: number;
  }>;
  flags: string[];
}

export interface ModeratorPortalData {
  moderator: {
    name: string;
    moderationBatches: number;
    complianceScore: number;
  };
  moderationQueue: Array<{
    batch: string;
    programme: string;
    sampleSize: number;
    status: string;
  }>;
  findings: Array<{
    category: string;
    total: number;
    severity: string;
  }>;
  actions: string[];
}

export interface EmployerPortalData {
  employer: {
    organisation: string;
    activePlacements: number;
    mentors: number;
  };
  placements: Array<{
    learner: string;
    site: string;
    mentor: string;
    status: string;
  }>;
  compliance: Array<{
    requirement: string;
    completion: number;
  }>;
  actions: string[];
}

export interface CompanyManagementUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface CompanyInvitation {
  id: string;
  companyId?: string;
  companyName?: string;
  recipientName: string;
  recipientEmail: string;
  role: string;
  status: string;
  sentAt: string;
  expiresAt: string;
  acceptanceLink: string;
  subject: string;
  preview: string;
  acceptedAt?: string;
}

export interface CompanyManagementData {
  company: {
    id: string;
    name: string;
    companyEmail: string;
    industry: string;
    requestedUsers: number;
    status: string;
  };
  isCompanyAdmin: boolean;
  users: CompanyManagementUser[];
  invitations: CompanyInvitation[];
}

export interface ParentPortalData {
  learner: {
    name: string;
    programme: string;
    attendance: number;
    progress: number;
  };
  alerts: Array<{
    message: string;
    level: string;
  }>;
  milestones: Array<{
    title: string;
    status: string;
  }>;
}

export interface PortalRenderProps {
  dashboardData: DashboardData | null;
  dashboardLoading: boolean;
}

export interface PortalDefinition {
  id: string;
  name: string;
  routePrefix: string;
  summary: string;
  allowedRoles: string[];
  component: ComponentType<PortalRenderProps>;
}
