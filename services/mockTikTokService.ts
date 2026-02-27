import { Campaign, RoleType, User, RoleDefinition } from '../types';

// Mock Data
const MOCK_CAMPAIGNS: Campaign[] = [
  { id: 'cmp_101', name: 'Summer Sale 2024 - GenZ', status: 'ACTIVE', budget: 5000, spent: 2340, impressions: 450000, clicks: 8500, conversions: 320, cpa: 7.31, roas: 3.2, objective: 'CONVERSIONS' },
  { id: 'cmp_102', name: 'Brand Awareness - TopView', status: 'PAUSED', budget: 10000, spent: 9800, impressions: 1200000, clicks: 12000, conversions: 50, cpa: 196.00, roas: 1.1, objective: 'REACH' },
  { id: 'cmp_103', name: 'App Install - Retargeting', status: 'ACTIVE', budget: 3000, spent: 1200, impressions: 150000, clicks: 4200, conversions: 800, cpa: 1.50, roas: 4.5, objective: 'APP_INSTALL' },
  { id: 'cmp_104', name: 'Influencer Collab #Spark', status: 'REVIEW', budget: 2000, spent: 0, impressions: 0, clicks: 0, conversions: 0, cpa: 0, roas: 0, objective: 'VIDEO_VIEWS' },
  { id: 'cmp_105', name: 'Black Friday Teaser', status: 'PAUSED', budget: 1500, spent: 1500, impressions: 300000, clicks: 6000, conversions: 120, cpa: 12.50, roas: 2.8, objective: 'TRAFFIC' },
];

const MOCK_USERS_LIST: User[] = [
  { id: 'u_1', name: 'Alice Chen', email: 'alice.chen@tiktok.com', role: RoleType.ADMIN, avatar: 'https://ui-avatars.com/api/?name=Alice+Chen&background=FE2C55&color=fff' },
  { id: 'u_2', name: 'Bob Smith', email: 'bob.smith@tiktok.com', role: RoleType.EDITOR, avatar: 'https://ui-avatars.com/api/?name=Bob+Smith&background=25F4EE&color=fff' },
  { id: 'u_3', name: 'Charlie Kim', email: 'charlie.kim@tiktok.com', role: RoleType.VIEWER, avatar: 'https://ui-avatars.com/api/?name=Charlie+Kim&background=000&color=fff' },
  { id: 'u_4', name: 'Diana Prince', email: 'diana.p@agency.com', role: RoleType.EDITOR, avatar: 'https://ui-avatars.com/api/?name=Diana+Prince&background=random' },
  { id: 'u_5', name: 'Evan Lee', email: 'evan.lee@marketing.com', role: RoleType.VIEWER, avatar: 'https://ui-avatars.com/api/?name=Evan+Lee&background=random' },
];

const MOCK_ROLES: RoleDefinition[] = [
  {
    type: RoleType.ADMIN,
    description: 'Full access to all settings, users, and campaigns.',
    permissions: [
      { resource: 'campaigns', canCreate: true, canRead: true, canUpdate: true, canDelete: true },
      { resource: 'users', canCreate: true, canRead: true, canUpdate: true, canDelete: true },
      { resource: 'finance', canCreate: true, canRead: true, canUpdate: true, canDelete: true },
      { resource: 'reports', canCreate: true, canRead: true, canUpdate: true, canDelete: true },
    ]
  },
  {
    type: RoleType.EDITOR,
    description: 'Can manage campaigns but cannot change system settings.',
    permissions: [
      { resource: 'campaigns', canCreate: true, canRead: true, canUpdate: true, canDelete: false },
      { resource: 'users', canCreate: false, canRead: true, canUpdate: false, canDelete: false },
      { resource: 'finance', canCreate: false, canRead: false, canUpdate: false, canDelete: false },
      { resource: 'reports', canCreate: true, canRead: true, canUpdate: true, canDelete: false },
    ]
  },
  {
    type: RoleType.VIEWER,
    description: 'Read-only access to campaign data.',
    permissions: [
      { resource: 'campaigns', canCreate: false, canRead: true, canUpdate: false, canDelete: false },
      { resource: 'users', canCreate: false, canRead: false, canUpdate: false, canDelete: false },
      { resource: 'finance', canCreate: false, canRead: false, canUpdate: false, canDelete: false },
      { resource: 'reports', canCreate: false, canRead: true, canUpdate: false, canDelete: false },
    ]
  }
];

export const getCampaigns = async (): Promise<Campaign[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_CAMPAIGNS), 600);
  });
};

export const getRoles = async (): Promise<RoleDefinition[]> => {
  return new Promise((resolve) => resolve(MOCK_ROLES));
};

export const getUsers = async (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_USERS_LIST), 500);
  });
};

export const loginUser = async (email: string): Promise<User> => {
  // Mock login logic
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'u_123',
        name: email.split('@')[0],
        email: email,
        role: RoleType.ADMIN,
        avatar: `https://ui-avatars.com/api/?name=${email}&background=FE2C55&color=fff`
      });
    }, 800);
  });
};