import { v4 as uuid } from 'uuid';

/**
 * In-memory + localStorage backed mock database for the Super Admin workspace.
 * This lets us iterate on the frontend quickly without depending on backend APIs.
 */

export type MockInviteStatus = 'PENDING' | 'USED' | 'REVOKED' | 'EXPIRED';

export interface MockInvitation {
  id: number;
  email: string;
  contactName: string;
  hospitalName: string;
  status: MockInviteStatus;
  planTier: 'Launch' | 'Growth' | 'Enterprise';
  templateSlug: 'modern-clinical' | 'heritage' | 'telehealth-first';
  internalOwner: string;
  region: string;
  expiresAt: string;
  invitedBy: number;
  usedAt: string | null;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  inviteToken: string;
  channel: 'email' | 'sms' | 'manual-link';
  notes?: string;
  hospitalDraft?: Record<string, unknown> | null;
}

export interface SuperAdminUser {
  id: number;
  email: string;
  password: string;
  fullName: string;
  title: string;
  lastLogin: string | null;
  isActive: boolean;
}

export interface SuperAdminDashboardMetrics {
  kpis: Array<{
    label: string;
    value: string;
    trendLabel: string;
    trendDelta: number;
    positive: boolean;
    icon: string;
  }>;
  onboardingFunnel: Array<{
    stage: string;
    count: number;
    delta: number;
  }>;
  alerts: Array<{
    id: string;
    severity: 'info' | 'warning' | 'critical';
    title: string;
    description: string;
    owner: string;
    createdAt: string;
  }>;
}

interface MockSuperAdminDB {
  users: SuperAdminUser[];
  invitations: MockInvitation[];
  dashboard: SuperAdminDashboardMetrics;
}

const STORAGE_KEY = '__athaarva_super_admin_mock_db__';

const now = new Date();

const seedDB: MockSuperAdminDB = {
  users: [
    {
      id: 1,
      email: 'super.admin@athaarva.com',
      password: 'supersecure',
      fullName: 'Aarav Mehta',
      title: 'Head of Platform Ops',
      lastLogin: new Date(now.getTime() - 1000 * 60 * 60 * 5).toISOString(),
      isActive: true,
    },
    {
      id: 2,
      email: 'compliance@athaarva.com',
      password: 'compliance123',
      fullName: 'Diya Kapoor',
      title: 'Compliance Officer',
      lastLogin: new Date(now.getTime() - 1000 * 60 * 60 * 26).toISOString(),
      isActive: true,
    },
  ],
  invitations: [
    {
      id: 301,
      email: 'ops@auroravalleyhealth.com',
      contactName: 'Priya Sengar',
      hospitalName: 'Aurora Valley Medical',
      status: 'PENDING',
      planTier: 'Growth',
      templateSlug: 'modern-clinical',
      internalOwner: 'Dhruv Patel',
      region: 'IN-West',
      expiresAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 6).toISOString(),
      invitedBy: 1,
      usedAt: null,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 36).toISOString(),
      updatedAt: new Date(now.getTime() - 1000 * 60 * 30).toISOString(),
      lastActivityAt: new Date(now.getTime() - 1000 * 60 * 45).toISOString(),
      inviteToken: 'aurora-growth-2025',
      channel: 'email',
      notes: 'Waiting on license upload + data processing agreement.',
      hospitalDraft: {
        servicesOffered: ['Cardiology', 'Tele-ICU', 'Diabetes'],
        hasTelehealthTeam: true,
        onboardingProgress: 68,
      },
    },
    {
      id: 302,
      email: 'hq@luminahospitals.com',
      contactName: 'Dr. Zahra Sheikh',
      hospitalName: 'Lumina Care Network',
      status: 'USED',
      planTier: 'Enterprise',
      templateSlug: 'telehealth-first',
      internalOwner: 'Santiago Vega',
      region: 'UAE',
      expiresAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      invitedBy: 1,
      usedAt: new Date(now.getTime() - 1000 * 60 * 60 * 12).toISOString(),
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 10).toISOString(),
      lastActivityAt: new Date(now.getTime() - 1000 * 60 * 60 * 9).toISOString(),
      inviteToken: 'lumina-enterprise-telehealth',
      channel: 'email',
      notes: 'Signed data residency addendum + AI usage policy.',
      hospitalDraft: {
        telehealthShare: 0.72,
        doctors: 85,
        hasMentorshipProgram: true,
      },
    },
    {
      id: 303,
      email: 'founder@northstarclinics.org',
      contactName: 'Aniket Rao',
      hospitalName: 'NorthStar Clinics',
      status: 'REVOKED',
      planTier: 'Launch',
      templateSlug: 'heritage',
      internalOwner: 'Kara Singh',
      region: 'IN-North',
      expiresAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 2).toISOString(),
      invitedBy: 2,
      usedAt: null,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 12).toISOString(),
      updatedAt: new Date(now.getTime() - 1000 * 60 * 15).toISOString(),
      lastActivityAt: new Date(now.getTime() - 1000 * 60 * 15).toISOString(),
      inviteToken: 'northstar-launch',
      channel: 'manual-link',
      notes: 'Revoked per compliance hold — pending updated insurance certificates.',
      hospitalDraft: null,
    },
    {
      id: 304,
      email: 'ops@sunsetcare.org',
      contactName: 'Marin Khan',
      hospitalName: 'Sunset Care Co-op',
      status: 'EXPIRED',
      planTier: 'Launch',
      templateSlug: 'modern-clinical',
      internalOwner: 'Dhruv Patel',
      region: 'US-West',
      expiresAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1).toISOString(),
      invitedBy: 1,
      usedAt: null,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10).toISOString(),
      updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1).toISOString(),
      lastActivityAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1).toISOString(),
      inviteToken: 'sunset-pilot',
      channel: 'sms',
      notes: 'Expired — they requested extension; awaiting new legal signatory.',
      hospitalDraft: {
        notes: 'Interested in telehealth + AI scribe pilot',
      },
    },
  ],
  dashboard: {
    kpis: [
      {
        label: 'Active Tenants',
        value: '42',
        trendLabel: 'vs. last month',
        trendDelta: 8,
        positive: true,
        icon: 'building',
      },
      {
        label: 'Onboarding Funnel',
        value: '11 in flight',
        trendLabel: 'avg. time to go-live',
        trendDelta: -2.3,
        positive: true,
        icon: 'rocket',
      },
      {
        label: 'Compliance Alerts',
        value: '3 open',
        trendLabel: 'SLA breach risk',
        trendDelta: 1,
        positive: false,
        icon: 'shield-alert',
      },
      {
        label: 'ARR (Projected)',
        value: '$4.2M',
        trendLabel: 'QTD',
        trendDelta: 12,
        positive: true,
        icon: 'activity',
      },
    ],
    onboardingFunnel: [
      { stage: 'Invited', count: 6, delta: 2 },
      { stage: 'In Review', count: 3, delta: -1 },
      { stage: 'Ready for Go-Live', count: 1, delta: 0 },
      { stage: 'Launched', count: 1, delta: 1 },
    ],
    alerts: [
      {
        id: uuid(),
        severity: 'critical',
        title: 'Telehealth AI guardrail pending approval',
        description: 'Aurora Valley enabled AI dictation without dual approval. Review before launch.',
        owner: 'Compliance',
        createdAt: new Date(now.getTime() - 1000 * 60 * 20).toISOString(),
      },
      {
        id: uuid(),
        severity: 'warning',
        title: '3 invites expiring in < 48h',
        description: 'NorthStar Clinics, Sunrise Oncology, and Riverbend Health need follow-up.',
        owner: 'Platform Ops',
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: uuid(),
        severity: 'info',
        title: 'Plan catalog update drafted',
        description: 'Finance queued Q2 pricing changes. Requires super admin sign-off.',
        owner: 'Finance',
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 6).toISOString(),
      },
    ],
  },
};

let memoryFallback: MockSuperAdminDB = structuredClone(seedDB);

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const clone = <T>(value: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
};

const readDB = (): MockSuperAdminDB => {
  if (!isBrowser()) {
    return memoryFallback;
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedDB));
    return clone(seedDB);
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Failed to parse mock DB. Re-seeding.', error);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedDB));
    return clone(seedDB);
  }
};

const writeDB = (db: MockSuperAdminDB) => {
  if (!isBrowser()) {
    memoryFallback = db;
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

const mutateDB = (mutator: (draft: MockSuperAdminDB) => void): MockSuperAdminDB => {
  const current = readDB();
  const draft = clone(current);
  mutator(draft);
  writeDB(draft);
  return draft;
};

const simulateLatency = async <T>(result: T, latency = 350): Promise<T> => {
  await new Promise((resolve) => setTimeout(resolve, latency + Math.random() * 200));
  return clone(result);
};

export const SuperAdminMockRepo = {
  async authenticate(email: string, password: string) {
    const db = readDB();
    const user = db.users.find((u) => u.email === email && u.password === password && u.isActive);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    user.lastLogin = new Date().toISOString();
    writeDB(db);
    return simulateLatency({
      access_token: `mock-${uuid()}`,
      token_type: 'bearer',
      expires_in: 60 * 60 * 4,
      profile: {
        id: user.id,
        email: user.email,
        full_name: user.fullName,
        is_active: user.isActive,
        created_at: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 180).toISOString(),
        last_login: user.lastLogin,
        title: user.title,
      },
    });
  },

  async getProfile() {
    const db = readDB();
    const user = db.users[0];
    return simulateLatency({
      id: user.id,
      email: user.email,
      full_name: user.fullName,
      is_active: user.isActive,
      created_at: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 180).toISOString(),
      last_login: user.lastLogin,
      title: user.title,
    });
  },

  async listInvitations(params: {
    page?: number;
    per_page?: number;
    status?: MockInviteStatus;
    search?: string;
    plan?: MockInvitation['planTier'];
  } = {}) {
    const db = readDB();
    const { page = 1, per_page = 20, status, search, plan } = params;
    let rows = [...db.invitations];

    if (status) {
      rows = rows.filter((invite) => invite.status === status);
    }

    if (plan) {
      rows = rows.filter((invite) => invite.planTier === plan);
    }

    if (search) {
      const query = search.toLowerCase();
      rows = rows.filter((invite) =>
        [invite.hospitalName, invite.email, invite.contactName, invite.region].some((value) =>
          value.toLowerCase().includes(query)
        )
      );
    }

    const total = rows.length;
    const totalPages = Math.max(1, Math.ceil(total / per_page));
    const start = (page - 1) * per_page;
    const paginated = rows.slice(start, start + per_page);

    return simulateLatency({
      invitations: paginated,
      total,
      per_page,
      page,
      total_pages: totalPages,
      summary: {
        expiringSoon: rows.filter(
          (invite) => invite.status === 'PENDING' && new Date(invite.expiresAt).getTime() - Date.now() < 1000 * 60 * 60 * 48
        ).length,
        pending: rows.filter((invite) => invite.status === 'PENDING').length,
        used: rows.filter((invite) => invite.status === 'USED').length,
        revoked: rows.filter((invite) => invite.status === 'REVOKED').length,
      },
    });
  },

  async createInvitation(payload: {
    email: string;
    contactName: string;
    hospitalName: string;
    planTier: MockInvitation['planTier'];
    templateSlug: MockInvitation['templateSlug'];
    internalOwner: string;
    region: string;
    expiresInDays: number;
    notes?: string;
  }) {
    const newInvite: MockInvitation = {
      id: Date.now(),
      email: payload.email,
      contactName: payload.contactName,
      hospitalName: payload.hospitalName,
      status: 'PENDING',
      planTier: payload.planTier,
      templateSlug: payload.templateSlug,
      internalOwner: payload.internalOwner,
      region: payload.region,
      expiresAt: new Date(Date.now() + payload.expiresInDays * 24 * 60 * 60 * 1000).toISOString(),
      invitedBy: 1,
      usedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      inviteToken: uuid(),
      channel: 'email',
      notes: payload.notes,
      hospitalDraft: {
        submittedBy: payload.contactName,
        checklist: {
          identity: false,
          branding: false,
          compliance: false,
        },
      },
    };

    const db = mutateDB((draft) => {
      draft.invitations.unshift(newInvite);
    });

    return simulateLatency({
      success: true,
      message: 'Invitation created',
      data: { invitation_id: newInvite.id },
      invitations: db.invitations,
    });
  },

  async revokeInvitation(invitationId: number) {
    let updatedInvite: MockInvitation | undefined;
    mutateDB((draft) => {
      const target = draft.invitations.find((invite) => invite.id === invitationId);
      if (!target) {
        throw new Error('Invitation not found');
      }
      target.status = 'REVOKED';
      target.updatedAt = new Date().toISOString();
      target.lastActivityAt = new Date().toISOString();
      target.notes = `${target.notes ?? ''} Revoked ${new Date().toLocaleDateString()}.`;
      updatedInvite = target;
    });

    if (!updatedInvite) {
      throw new Error('Invitation not found');
    }

    return simulateLatency({ success: true, message: 'Invitation revoked', invitation: updatedInvite });
  },

  async cleanupExpiredInvitations() {
    const nowTs = Date.now();
    const result = mutateDB((draft) => {
      draft.invitations = draft.invitations.map((invite) => {
        if (invite.status === 'PENDING' && new Date(invite.expiresAt).getTime() < nowTs) {
          return { ...invite, status: 'EXPIRED', updatedAt: new Date().toISOString(), lastActivityAt: new Date().toISOString() };
        }
        return invite;
      });
    });

    const expired = result.invitations.filter((invite) => invite.status === 'EXPIRED');
    return simulateLatency({
      success: true,
      message: `Marked ${expired.length} invitation(s) as expired`,
      expiredCount: expired.length,
    });
  },

  async getDashboardSnapshot() {
    const db = readDB();
    return simulateLatency(db.dashboard);
  },

  reset() {
    writeDB(clone(seedDB));
  },
};
