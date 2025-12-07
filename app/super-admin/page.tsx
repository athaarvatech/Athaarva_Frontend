"use client";

import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Building2,
  ShieldAlert,
  Rocket,
  ExternalLink,
  Timer,
  Users,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { superAdminAPI, type DashboardMetrics, type InvitationResponse } from '@/lib/api';

// Dashboard metrics type with KPIs and funnel data
interface DashboardData {
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

// Invitation summary for dashboard
interface InvitationSummary {
  expiringSoon: number;
  pending: number;
  used: number;
  revoked: number;
}

// Recent invitation display type
interface RecentInvitation {
  id: string;
  hospitalName: string;
  contactName: string;
  planTier: string;
  status: string;
}

export default function SuperAdminDashboardPage() {
  const [snapshot, setSnapshot] = useState<DashboardData | null>(null);
  const [invitesSummary, setInvitesSummary] = useState<InvitationSummary | null>(null);
  const [recentInvites, setRecentInvites] = useState<RecentInvitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        // Fetch dashboard data from real API (with mock fallback)
        const dashboardData = await superAdminAPI.getDashboard();
        
        // Transform API response to dashboard format
        const transformedDashboard: DashboardData = {
          kpis: [
            {
              label: 'Active Tenants',
              value: String(dashboardData.active_tenants || 0),
              trendLabel: 'vs. last month',
              trendDelta: 8,
              positive: true,
              icon: 'building',
            },
            {
              label: 'Onboarding Funnel',
              value: `${dashboardData.pending_onboarding || 0} in flight`,
              trendLabel: 'avg. time to go-live',
              trendDelta: -2.3,
              positive: true,
              icon: 'rocket',
            },
            {
              label: 'Pending Invitations',
              value: `${dashboardData.pending_invitations || 0} pending`,
              trendLabel: 'awaiting acceptance',
              trendDelta: dashboardData.pending_invitations > 5 ? -1 : 1,
              positive: dashboardData.pending_invitations <= 5,
              icon: 'shield-alert',
            },
            {
              label: 'Total Users',
              value: String(dashboardData.total_users || 0),
              trendLabel: 'across all tenants',
              trendDelta: dashboardData.total_users || 0,
              positive: true,
              icon: 'activity',
            },
          ],
          onboardingFunnel: [
            { stage: 'Invited', count: dashboardData.pending_invitations || 0, delta: 2 },
            { stage: 'In Review', count: dashboardData.pending_onboarding || 0, delta: -1 },
            { stage: 'Ready for Go-Live', count: Math.floor((dashboardData.pending_onboarding || 0) / 2), delta: 0 },
            { stage: 'Launched', count: dashboardData.active_tenants || 0, delta: 1 },
          ],
          alerts: dashboardData.recent_invitations?.slice(0, 3).map((inv: InvitationResponse, idx: number) => ({
            id: `alert-${idx}`,
            severity: idx === 0 ? 'info' as const : idx === 1 ? 'warning' as const : 'info' as const,
            title: `Invitation: ${inv.email}`,
            description: `Status: ${inv.status} - Created ${new Date(inv.created_at).toLocaleDateString()}`,
            owner: 'Platform Ops',
            createdAt: inv.created_at,
          })) || [],
        };
        
        setSnapshot(transformedDashboard);
        
        // Fetch invitations for summary
        const invitationData = await superAdminAPI.listInvitations({ limit: 10 });
        
        // Calculate invitation summary
        const summary: InvitationSummary = {
          pending: invitationData.filter((i: InvitationResponse) => i.status === 'pending').length,
          used: invitationData.filter((i: InvitationResponse) => i.status === 'accepted').length,
          revoked: invitationData.filter((i: InvitationResponse) => i.status === 'revoked').length,
          expiringSoon: invitationData.filter((i: InvitationResponse) => {
            if (i.status !== 'pending') return false;
            const expiresAt = new Date(i.expires_at).getTime();
            const now = Date.now();
            return expiresAt - now < 48 * 60 * 60 * 1000; // 48 hours
          }).length,
        };
        setInvitesSummary(summary);
        
        // Transform recent invitations for display
        const recentInvs: RecentInvitation[] = invitationData.slice(0, 4).map((inv: InvitationResponse) => ({
          id: inv.id,
          hospitalName: (inv.metadata as { hospital_name?: string })?.hospital_name || 'Unknown Hospital',
          contactName: (inv.metadata as { contact_name?: string })?.contact_name || inv.email,
          planTier: (inv.metadata as { plan_tier?: string })?.plan_tier || 'Standard',
          status: inv.status.toUpperCase(),
        }));
        setRecentInvites(recentInvs);
        
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // Set empty/default state on error
        setSnapshot({
          kpis: [
            { label: 'Active Tenants', value: '0', trendLabel: 'loading...', trendDelta: 0, positive: true, icon: 'building' },
            { label: 'Onboarding Funnel', value: '0 in flight', trendLabel: 'loading...', trendDelta: 0, positive: true, icon: 'rocket' },
            { label: 'Pending Invitations', value: '0 pending', trendLabel: 'loading...', trendDelta: 0, positive: true, icon: 'shield-alert' },
            { label: 'Total Users', value: '0', trendLabel: 'loading...', trendDelta: 0, positive: true, icon: 'activity' },
          ],
          onboardingFunnel: [],
          alerts: [],
        });
        setInvitesSummary({ pending: 0, used: 0, revoked: 0, expiringSoon: 0 });
        setRecentInvites([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const severityStyles: Record<'info' | 'warning' | 'critical', string> = {
    critical: 'border-red-500/30 bg-red-500/10 text-red-100',
    warning: 'border-yellow-400/30 bg-yellow-400/10 text-yellow-50',
    info: 'border-sky-400/30 bg-sky-400/10 text-sky-50',
  };

  const iconForKpi = (icon: string) => {
    switch (icon) {
      case 'building':
        return <Building2 className="h-5 w-5" />;
      case 'rocket':
        return <Rocket className="h-5 w-5" />;
      case 'shield-alert':
        return <ShieldAlert className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const guardrailTasks = useMemo(
    () => [
      {
        id: 'audit-telehealth',
        title: 'Dual-approval enforcement for telehealth AI notes',
        owner: 'Compliance',
        due: 'Due in 2 days',
        status: 'Action required',
      },
      {
        id: 'plan-q2',
        title: 'Sign-off Q2 plan catalog + localization bundles',
        owner: 'Finance',
        due: 'In review',
        status: 'Waiting on you',
      },
      {
        id: 'dns-rollout',
        title: 'DNS + SSL verification for Aurora Valley domains',
        owner: 'Platform Ops',
        due: 'Ready for execution',
        status: 'Ready',
      },
    ],
    []
  );

  if (loading || !snapshot) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-white/50 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-white/80">Loading platform intelligence…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-white/50 text-xs uppercase tracking-[0.4em] mb-2">Overview</p>
        <h2 className="text-3xl font-semibold">Platform command center</h2>
        <p className="text-white/70 mt-2 max-w-3xl">
          Real-time signals spanning tenant onboarding, plan governance, guardrail alerts, and AI/compliance telemetry.
          Everything here is mock data so you can design the UI without backend dependencies.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {snapshot.kpis.map((kpi) => (
          <Card key={kpi.label} className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-white/70 text-xs uppercase tracking-wide">{kpi.label}</div>
                <div className="rounded-full bg-white/10 p-2 text-white/80">{iconForKpi(kpi.icon)}</div>
              </div>
              <div className="text-2xl font-semibold mb-1">{kpi.value}</div>
              <div className="text-sm text-white/70 flex items-center gap-2">
                <span
                  className={cn(
                    'font-semibold',
                    kpi.positive ? 'text-emerald-300' : 'text-red-300'
                  )}
                >
                  {kpi.trendDelta > 0 ? `+${kpi.trendDelta}` : kpi.trendDelta}
                </span>
                <span>{kpi.trendLabel}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        {/* Onboarding funnel */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Tenant onboarding funnel</CardTitle>
              <p className="text-sm text-white/60">Signal from the latest invitations and review checkpoints</p>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-200 border-emerald-500/20">
              SLA target: 14 days
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {snapshot.onboardingFunnel.map((stage) => (
              <div key={stage.stage} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/80">{stage.stage}</span>
                  <span className="text-white/60">
                    {stage.count} tenants
                    <span className={cn('ml-2', stage.delta >= 0 ? 'text-emerald-300' : 'text-red-300')}>
                      {stage.delta >= 0 ? `+${stage.delta}` : stage.delta}
                    </span>
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-200"
                    style={{ width: `${Math.min(100, stage.count * 12)}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Invitation pulse */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle>Invitation pulse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
                <p className="text-xs uppercase tracking-wider text-white/60">Pending</p>
                <p className="text-2xl font-semibold">{invitesSummary?.pending ?? 0}</p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
                <p className="text-xs uppercase tracking-wider text-white/60">Expiring &lt; 48h</p>
                <p className="text-2xl font-semibold text-yellow-200">{invitesSummary?.expiringSoon ?? 0}</p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
                <p className="text-xs uppercase tracking-wider text-white/60">Used</p>
                <p className="text-2xl font-semibold text-emerald-200">{invitesSummary?.used ?? 0}</p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
                <p className="text-xs uppercase tracking-wider text-white/60">Revoked</p>
                <p className="text-2xl font-semibold text-red-200">{invitesSummary?.revoked ?? 0}</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wider text-white/60">Latest activity</p>
              {recentInvites.map((invite) => (
                <div key={invite.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{invite.hospitalName}</p>
                    <p className="text-white/60">{invite.contactName} · {invite.planTier}</p>
                  </div>
                  <Badge
                    className={cn(
                      'text-xs capitalize border-0',
                      invite.status === 'PENDING' && 'bg-yellow-500/30 text-yellow-50',
                      invite.status === 'USED' && 'bg-emerald-500/30 text-emerald-50',
                      invite.status === 'REVOKED' && 'bg-red-500/30 text-red-50',
                      invite.status === 'EXPIRED' && 'bg-slate-500/30 text-slate-50'
                    )}
                  >
                    {invite.status.toLowerCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Alerts */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Guardrails & alerts</CardTitle>
              <p className="text-sm text-white/60">Everything that needs a super admin decision</p>
            </div>
            <Button variant="outline" className="border-white/20 text-white/80">
              Export log
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {snapshot.alerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  'rounded-2xl border px-4 py-4 flex flex-col gap-2',
                  severityStyles[alert.severity]
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{alert.title}</p>
                  <Badge variant="secondary" className="bg-white/10 text-white/80 border-white/10">
                    {alert.owner}
                  </Badge>
                </div>
                <p className="text-sm text-white/80">{alert.description}</p>
                <div className="text-xs text-white/70">
                  Raised {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Task queue */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle>Operational queue</CardTitle>
            <p className="text-sm text-white/60">Pulled from automation rules & delegation workflow</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {guardrailTasks.map((task) => (
              <div key={task.id} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{task.title}</p>
                    <p className="text-sm text-white/60">Owner: {task.owner}</p>
                  </div>
                  <Badge className="bg-white/10 text-white/80 border-white/10">{task.status}</Badge>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
                  <Timer className="h-3.5 w-3.5" />
                  {task.due}
                </div>
                <Button variant="ghost" size="sm" className="mt-3 text-white/80">
                  Review playbook
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle>Plan catalog checkpoints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-4 w-4 text-white/70" />
              <div>
                <p>Usage-based billing thresholds ready for QA</p>
                <p className="text-white/60">Finance · Draft v2</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-white/70" />
              <div>
                <p>AI bundle add-on approved for Growth plan</p>
                <p className="text-white/60">Compliance · Signed-off</p>
              </div>
            </div>
            <Button variant="outline" className="w-full border-white/20 text-white/80 mt-4">
              Manage plan catalog
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle>Template readiness</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
              <p className="font-semibold">Modern Clinical v3</p>
              <p className="text-white/60">Accessibility QA: 90% · 4 blockers open</p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
              <p className="font-semibold">Telehealth First v2</p>
              <p className="text-white/60">AI triage widgets flagged for copy review</p>
            </div>
            <Button variant="outline" className="w-full border-white/20 text-white/80 mt-4">
              Preview template library
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle>People & access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-white/70" />
              <div>
                <p>2 new super admin operators awaiting MFA enrollment</p>
                <p className="text-white/60">Security · Action needed</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-4 w-4 text-white/70" />
              <div>
                <p>Impersonation session audit due EOD</p>
                <p className="text-white/60">Ops · Log export queued</p>
              </div>
            </div>
            <Button variant="outline" className="w-full border-white/20 text-white/80 mt-4">
              Open access governance
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
