export enum RoleType {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  avatar: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'REVIEW';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cpa: number;
  roas: number;
  objective: string;
}

export interface Permission {
  resource: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export interface RoleDefinition {
  type: RoleType;
  description: string;
  permissions: Permission[];
}

export interface GeminiAnalysisResult {
  analysis: string;
  suggestions: string[];
}