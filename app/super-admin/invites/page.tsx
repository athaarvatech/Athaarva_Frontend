"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Mail,
  Send,
  Filter,
  Search,
  RefreshCcw,
  Globe2,
  NotebookPen,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Copy,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { superAdminAPI, type InvitationResponse, type CreateInvitationRequest } from '@/lib/api';
import { cn } from '@/lib/utils';

// Invitation statuses
type InviteStatus = 'pending' | 'accepted' | 'revoked' | 'expired';

// Composer state for creating new invitations
type ComposerState = {
  email: string;
  contactName: string;
  hospitalName: string;
  planTier: 'Launch' | 'Growth' | 'Enterprise';
  templateSlug: 'modern-clinical' | 'heritage' | 'telehealth-first';
  internalOwner: string;
  region: string;
  expiresInDays: number;
  notes: string;
};

// Invitation list response structure
interface InvitationListData {
  invitations: InvitationResponse[];
  total: number;
  page: number;
  total_pages: number;
  summary: {
    pending: number;
    expiringSoon: number;
    used: number;
    revoked: number;
  };
}

const initialComposer: ComposerState = {
  email: '',
  contactName: '',
  hospitalName: '',
  planTier: 'Growth',
  templateSlug: 'modern-clinical',
  internalOwner: 'Platform Ops',
  region: 'IN-West',
  expiresInDays: 7,
  notes: 'Includes telehealth readiness checklist + AI usage policy preview.',
};

const statusPills: Array<{ label: string; value: InviteStatus | ''; tone: string }> = [
  { label: 'All', value: '', tone: 'bg-white/10 text-white' },
  { label: 'Pending', value: 'pending', tone: 'bg-yellow-500/20 text-yellow-100' },
  { label: 'Accepted', value: 'accepted', tone: 'bg-emerald-500/20 text-emerald-100' },
  { label: 'Revoked', value: 'revoked', tone: 'bg-red-500/20 text-red-100' },
  { label: 'Expired', value: 'expired', tone: 'bg-slate-500/20 text-slate-100' },
];

const planOptions: ComposerState['planTier'][] = ['Launch', 'Growth', 'Enterprise'];

const formatTemplateName = (slug: ComposerState['templateSlug']) =>
  slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const buildEmailContent = (data: ComposerState) => {
  const friendlyTemplate = formatTemplateName(data.templateSlug);
  const subject = `Your Athaarva onboarding link – ${data.hospitalName}`;
  const text = `Hi ${data.contactName || 'team'},\n\n` +
    `Here is your secure onboarding link for the ${data.planTier} plan using the ${friendlyTemplate} template. ` +
    `This link expires in ${data.expiresInDays} days. Reach out to ${data.internalOwner} if you need anything.\n\n` +
    'Thanks,\nAthaarva Platform Team';

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a;">
      <p>Hi ${data.contactName || 'team'},</p>
      <p>
        Here is your secure onboarding link for the <strong>${data.planTier}</strong> plan using the
        <strong>${friendlyTemplate}</strong> template.
      </p>
      <p>
        This invitation expires in <strong>${data.expiresInDays} days</strong>. If you need more time, reply to this email and
        ${data.internalOwner} will extend the window.
      </p>
      <ul>
        <li>Region: ${data.region}</li>
        <li>Owner: ${data.internalOwner}</li>
        <li>Template: ${friendlyTemplate}</li>
      </ul>
      <p>Thanks,<br />Athaarva Platform Team</p>
    </div>
  `;

  return { subject, text, html };
};

export default function SuperAdminInvitesPage() {
  const [composer, setComposer] = useState<ComposerState>(initialComposer);
  const [inviteData, setInviteData] = useState<InvitationListData | null>(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<InviteStatus | ''>('');
  const [planFilter, setPlanFilter] = useState<ComposerState['planTier'] | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadInvites = useCallback(async () => {
    setLoading(true);
    try {
      const invitations = await superAdminAPI.listInvitations({
        status: statusFilter || undefined,
        limit: 10,
        offset: (page - 1) * 10,
      });
      
      // Calculate summary from the invitations
      const summary = {
        pending: invitations.filter(i => i.status === 'pending').length,
        expiringSoon: invitations.filter(i => {
          if (i.status !== 'pending') return false;
          const expiresAt = new Date(i.expires_at).getTime();
          return expiresAt - Date.now() < 48 * 60 * 60 * 1000;
        }).length,
        used: invitations.filter(i => i.status === 'accepted').length,
        revoked: invitations.filter(i => i.status === 'revoked').length,
      };
      
      // Filter by plan tier from metadata if set
      let filteredInvitations = invitations;
      if (planFilter) {
        filteredInvitations = invitations.filter(i => 
          (i.metadata as { plan_tier?: string })?.plan_tier === planFilter
        );
      }
      
      // Filter by search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        filteredInvitations = filteredInvitations.filter(i => 
          i.email.toLowerCase().includes(query) ||
          ((i.metadata as { hospital_name?: string })?.hospital_name || '').toLowerCase().includes(query) ||
          ((i.metadata as { contact_name?: string })?.contact_name || '').toLowerCase().includes(query) ||
          ((i.metadata as { region?: string })?.region || '').toLowerCase().includes(query)
        );
      }
      
      setInviteData({
        invitations: filteredInvitations,
        total: filteredInvitations.length,
        page,
        total_pages: Math.max(1, Math.ceil(filteredInvitations.length / 10)),
        summary,
      });
    } catch (error) {
      console.error('Failed to load invitations:', error);
      toast.error('Failed to load invitations');
      setInviteData({
        invitations: [],
        total: 0,
        page: 1,
        total_pages: 1,
        summary: { pending: 0, expiringSoon: 0, used: 0, revoked: 0 },
      });
    } finally {
      setLoading(false);
    }
  }, [page, planFilter, searchTerm, statusFilter]);

  useEffect(() => {
    loadInvites();
  }, [loadInvites]);

  const handleComposeChange = (field: keyof ComposerState, value: string | number) => {
    setComposer((prev) => ({ ...prev, [field]: value }));
  };

  const handleSendInvite = async () => {
    if (!composer.email || !composer.contactName || !composer.hospitalName) {
      toast.error('Please fill in required fields.');
      return;
    }
    setSending(true);
    try {
      // Create invitation via real API
      const request: CreateInvitationRequest = {
        email: composer.email,
        hospital_name: composer.hospitalName,
        expires_in_hours: composer.expiresInDays * 24,
        metadata: {
          contact_name: composer.contactName,
          hospital_name: composer.hospitalName,
          plan_tier: composer.planTier,
          template_slug: composer.templateSlug,
          internal_owner: composer.internalOwner,
          region: composer.region,
          notes: composer.notes,
        },
      };
      
      const result = await superAdminAPI.createInvitation(request);
      toast.success('Invitation created successfully');

      // Try to send email
      try {
        const emailContent = buildEmailContent(composer);
        const response = await fetch('/api/smtp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: composer.email,
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text,
            token: result.token, // Include the invitation token
          }),
        });

        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}));
          throw new Error(errorBody.message || 'SMTP send failed');
        }

        toast.success(`Email sent to ${composer.email}`);
      } catch (emailError) {
        const message = emailError instanceof Error ? emailError.message : 'SMTP send failed';
        toast.error(`Invite saved but email failed: ${message}`);
      }

      setComposer(initialComposer);
      loadInvites();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to send invitation';
      toast.error(message);
    } finally {
      setSending(false);
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      await superAdminAPI.revokeInvitation(id);
      toast.warning('Invitation revoked');
      loadInvites();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to revoke invitation';
      toast.error(message);
    }
  };

  const handleCleanup = async () => {
    // Note: Cleanup is handled automatically by the backend
    toast.info('Expired invitations are automatically cleaned up by the system');
    loadInvites();
  };

  // Helper to extract metadata fields
  const getMetadata = (inv: InvitationResponse) => {
    const meta = inv.metadata as {
      hospital_name?: string;
      contact_name?: string;
      plan_tier?: string;
      template_slug?: string;
      internal_owner?: string;
      region?: string;
    } || {};
    return {
      hospitalName: meta.hospital_name || 'Unknown Hospital',
      contactName: meta.contact_name || inv.email,
      planTier: meta.plan_tier || 'Standard',
      templateSlug: meta.template_slug || 'modern-clinical',
      internalOwner: meta.internal_owner || 'Platform Ops',
      region: meta.region || 'Global',
    };
  };

  const timeline = useMemo(() => {
    if (!inviteData) return [];
    return inviteData.invitations.slice(0, 4).map((invite: InvitationResponse) => {
      const meta = getMetadata(invite);
      return {
        id: invite.id,
        hospital: meta.hospitalName,
        stage: invite.status,
        timestamp: invite.updated_at,
        owner: meta.internalOwner,
      };
    });
  }, [inviteData]);

  const statusBadge = (status: InviteStatus) => {
    const base = 'px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 capitalize';
    switch (status) {
      case 'pending':
        return <span className={cn(base, 'bg-yellow-500/20 text-yellow-100')}><Clock className="h-3 w-3" /> pending</span>;
      case 'accepted':
        return <span className={cn(base, 'bg-emerald-500/20 text-emerald-100')}><CheckCircle2 className="h-3 w-3" /> accepted</span>;
      case 'revoked':
        return <span className={cn(base, 'bg-red-500/20 text-red-100')}><XCircle className="h-3 w-3" /> revoked</span>;
      case 'expired':
        return <span className={cn(base, 'bg-slate-500/20 text-slate-100')}><AlertTriangle className="h-3 w-3" /> expired</span>;
    }
    return null;
  };

  return (
    <div className="space-y-8 text-white">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Tenant lifecycle</p>
          <h2 className="text-3xl font-semibold">Invitations & onboarding runway</h2>
          <p className="text-white/70 max-w-2xl">
            Map every hospital invite to plans, templates, and compliance checkpoints. All data is mocked locally so you can refine UX before wiring actual SMTP + APIs.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/20 text-white/80" onClick={handleCleanup}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Cleanup expired
          </Button>
          <Button onClick={handleSendInvite} disabled={sending} className="bg-red-500 hover:bg-red-400">
            {sending ? 'Sending…' : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send invitation
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-6">
            <p className="text-sm text-white/60">Pending invites</p>
            <p className="text-3xl font-semibold">{inviteData?.summary.pending ?? '—'}</p>
            <p className="text-xs text-white/50">Target follow-up in &lt; 48h</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-6">
            <p className="text-sm text-white/60">Expiring soon</p>
            <p className="text-3xl font-semibold text-yellow-200">{inviteData?.summary.expiringSoon ?? '—'}</p>
            <p className="text-xs text-white/50">Auto reminders queued</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-6">
            <p className="text-sm text-white/60">Converted</p>
            <p className="text-3xl font-semibold text-emerald-200">{inviteData?.summary.used ?? '—'}</p>
            <p className="text-xs text-white/50">Last 30 days</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-6">
            <p className="text-sm text-white/60">Revoked</p>
            <p className="text-3xl font-semibold text-red-200">{inviteData?.summary.revoked ?? '—'}</p>
            <p className="text-xs text-white/50">Compliance or stale</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[3fr,2fr]">
        {/* Composer */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle>Compose invitation</CardTitle>
            <p className="text-sm text-white/70">Plan, template, and guardrail choices map to onboarding wizard defaults.</p>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Hospital contact email</Label>
              <Input
                type="email"
                placeholder="ops@hospital.com"
                value={composer.email}
                onChange={(e) => handleComposeChange('email', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
            </div>
            <div className="space-y-2">
              <Label>Point of contact</Label>
              <Input
                placeholder="Priya Sengar"
                value={composer.contactName}
                onChange={(e) => handleComposeChange('contactName', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
            </div>
            <div className="space-y-2">
              <Label>Hospital name</Label>
              <Input
                placeholder="Aurora Valley Medical"
                value={composer.hospitalName}
                onChange={(e) => handleComposeChange('hospitalName', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
            </div>
            <div className="space-y-2">
              <Label>Plan tier</Label>
              <select
                value={composer.planTier}
                onChange={(e) => handleComposeChange('planTier', e.target.value)}
                className="bg-white/10 border-white/20 text-white rounded-md px-3 py-2"
              >
                {planOptions.map((plan) => (
                  <option key={plan} value={plan} className="text-slate-900">{plan}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Template</Label>
              <select
                value={composer.templateSlug}
                onChange={(e) => handleComposeChange('templateSlug', e.target.value)}
                className="bg-white/10 border-white/20 text-white rounded-md px-3 py-2"
              >
                <option value="modern-clinical" className="text-slate-900">Modern Clinical v3</option>
                <option value="telehealth-first" className="text-slate-900">Telehealth First v2</option>
                <option value="heritage" className="text-slate-900">Heritage Classic</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Internal owner</Label>
              <Input
                placeholder="Platform Ops"
                value={composer.internalOwner}
                onChange={(e) => handleComposeChange('internalOwner', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
            </div>
            <div className="space-y-2">
              <Label>Region</Label>
              <Input
                placeholder="IN-West"
                value={composer.region}
                onChange={(e) => handleComposeChange('region', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
            </div>
            <div className="space-y-2">
              <Label>Expiry (days)</Label>
              <Input
                type="number"
                min={3}
                max={30}
                value={composer.expiresInDays}
                onChange={(e) => handleComposeChange('expiresInDays', Number(e.target.value) || 7)}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label>Notes / guardrails context</Label>
              <Textarea
                rows={3}
                value={composer.notes}
                onChange={(e) => handleComposeChange('notes', e.target.value)}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Preview + timeline */}
        <Card className="bg-gradient-to-b from-slate-900/60 to-slate-900 border-white/10">
          <CardHeader>
            <CardTitle>Email + onboarding preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-3 text-sm text-white/80">
              <div className="flex items-center gap-2 text-white">
                <Mail className="h-4 w-4" /> SMTP draft
              </div>
              <p>Hi {composer.contactName || 'team'},</p>
              <p>
                Here&apos;s your secure onboarding link for the {composer.planTier} plan using the {formatTemplateName(composer.templateSlug)} site template.
                This includes policy acknowledgements for AI guardrails and telehealth readiness.
              </p>
              <div className="flex items-center gap-3 text-xs">
                <Badge className="bg-emerald-500/20 text-emerald-100 border-0">Token auto-generates</Badge>
                <Badge className="bg-white/10 border-white/10 text-white/70">Expires in {composer.expiresInDays} days</Badge>
              </div>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-4">
              <p className="text-xs uppercase tracking-wider text-white/50">Recent activity</p>
              <div className="space-y-3">
                {timeline.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-semibold">{item.hospital}</p>
                      <p className="text-white/60">Owner: {item.owner}</p>
                    </div>
                    {statusBadge(item.stage as InviteStatus)}
                  </div>
                ))}
                {timeline.length === 0 && (
                  <p className="text-white/60 text-sm">No recent changes. Compose a new invite to populate the stream.</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-white/80">
                <ShieldCheck className="h-4 w-4" /> Checklist preview
              </div>
              <ul className="list-disc list-inside text-white/60 space-y-1">
                <li>Identity verification + policy acknowledgements</li>
                <li>Brand + template content builder</li>
                <li>Telehealth + AI guardrail configuration</li>
                <li>Initial staff invites & MFA requirements</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters + table */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle>Invitation ledger</CardTitle>
          <p className="text-sm text-white/70">Filters align with auditing requirements (status, plan, owner, region).</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {statusPills.map((pill) => (
                <button
                  key={pill.label}
                  onClick={() => {
                    setPage(1);
                    setStatusFilter(pill.value);
                  }}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-semibold border border-white/10 transition',
                    statusFilter === pill.value ? pill.tone : 'text-white/60 hover:text-white'
                  )}
                >
                  {pill.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search hospital, region, contact"
                  className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Filter className="h-4 w-4" />
                <select
                  value={planFilter || ''}
                  onChange={(e) => {
                    setPlanFilter((e.target.value || '') as ComposerState['planTier'] | '');
                    setPage(1);
                  }}
                  className="bg-white/10 border-white/20 text-white rounded-md px-3 py-1"
                >
                  <option value="" className="text-slate-900">All plans</option>
                  {planOptions.map((plan) => (
                    <option key={plan} value={plan} className="text-slate-900">{plan}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Plan / Template</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Last activity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-white/60">
                      Loading invitations…
                    </TableCell>
                  </TableRow>
                )}
                {!loading && inviteData?.invitations.map((invite: InvitationResponse) => {
                  const meta = getMetadata(invite);
                  return (
                  <TableRow key={invite.id}>
                    <TableCell>
                      <div className="font-semibold">{meta.hospitalName}</div>
                      <div className="text-sm text-white/60">{invite.email}</div>
                    </TableCell>
                    <TableCell>
                      <div>{meta.contactName}</div>
                      <div className="text-xs text-white/60">Owner: {meta.internalOwner}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Badge className="bg-white/10 border-white/10 text-white/80">{meta.planTier}</Badge>
                        <Badge className="bg-white/5 border-white/10 text-white/60 capitalize">{meta.templateSlug}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>{statusBadge(invite.status)}</TableCell>
                    <TableCell className="text-sm text-white/80 flex items-center gap-2">
                      <Globe2 className="h-4 w-4" /> {meta.region}
                    </TableCell>
                    <TableCell className="text-sm text-white/70">
                      {new Date(invite.updated_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white/70"
                          onClick={() => navigator.clipboard.writeText(invite.id).then(() => toast.success('Invitation ID copied'))}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        {invite.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-200 hover:text-red-100"
                            onClick={() => handleRevoke(invite.id)}
                          >
                            <NotebookPen className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  );
                })}
                {!loading && !inviteData?.invitations.length && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-white/60">
                      No invitations match the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {inviteData && inviteData.total_pages > 1 && (
            <div className="flex items-center justify-between text-sm text-white/60">
              <span>
                Page {inviteData.page} of {inviteData.total_pages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={inviteData.page === 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className="border-white/20 text-white/80"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={inviteData.page === inviteData.total_pages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="border-white/20 text-white/80"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
