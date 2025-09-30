"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Mail,
  Plus,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Shield,
  UserPlus,
  Calendar,
  Filter,
  RotateCcw
} from 'lucide-react';
import { SuperAdminAPIService } from '@/lib/super-admin-api';

interface Invitation {
  id: number;
  email: string;
  status: 'PENDING' | 'USED' | 'REVOKED' | 'EXPIRED';
  hospital_draft: unknown;
  expires_at: string;
  invited_by: number;
  used_at: string | null;
  created_at: string;
  updated_at: string;
}

interface SuperAdminProfile {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
  last_login: string | null;
}

export default function SuperAdminInvitesPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<SuperAdminProfile | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  // New invitation modal
  const [showNewInviteModal, setShowNewInviteModal] = useState(false);
  const [newInviteData, setNewInviteData] = useState({
    email: '',
    expires_in_days: 7,
    hospital_draft: '',
  });
  const [isSending, setIsSending] = useState(false);

  // Check authentication on mount
  const loadProfile = useCallback(async () => {
    try {
      const profileData = await SuperAdminAPIService.getProfile();
      setProfile(profileData);
    } catch (err) {
      console.error('Failed to load profile:', err);
      SuperAdminAPIService.logout();
      router.replace('/super-admin/login');
    }
  }, [router]);

  const loadInvitations = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await SuperAdminAPIService.getInvitations({
        page: currentPage,
        per_page: 20,
        ...(statusFilter && { status: statusFilter as any }),
      });
      
      setInvitations(data.invitations);
      setTotalPages(data.total_pages);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invitations');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    if (!SuperAdminAPIService.isAuthenticated()) {
      router.replace('/super-admin/login');
      return;
    }

    if (!profile) {
      loadProfile();
    }

    loadInvitations();
  }, [router, profile, loadProfile, loadInvitations]);

  const handleCreateInvitation = async () => {
    setIsSending(true);
    setError('');
    setSuccess('');

    try {
      let hospitalDraft = null;
      if (newInviteData.hospital_draft.trim()) {
        try {
          hospitalDraft = JSON.parse(newInviteData.hospital_draft);
        } catch {
          throw new Error('Invalid JSON in hospital draft');
        }
      }

      await SuperAdminAPIService.createInvitation({
        email: newInviteData.email,
        expires_in_days: newInviteData.expires_in_days,
        hospital_draft: hospitalDraft,
      });

      setSuccess('Invitation sent successfully!');
      setShowNewInviteModal(false);
      setNewInviteData({ email: '', expires_in_days: 7, hospital_draft: '' });
      loadInvitations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create invitation');
    } finally {
      setIsSending(false);
    }
  };

  const handleRevokeInvitation = async (invitationId: number) => {
    if (!confirm('Are you sure you want to revoke this invitation?')) return;

    try {
      await SuperAdminAPIService.revokeInvitation(invitationId);
      setSuccess('Invitation revoked successfully');
      loadInvitations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revoke invitation');
    }
  };

  const handleCleanupExpired = async () => {
    try {
      const result = await SuperAdminAPIService.cleanupExpiredInvitations();
      setSuccess(result.message);
      loadInvitations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cleanup expired invitations');
    }
  };

  const handleLogout = () => {
    SuperAdminAPIService.logout();
    router.push('/super-admin/login');
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      USED: 'bg-green-100 text-green-800 border-green-200',
      REVOKED: 'bg-red-100 text-red-800 border-red-200',
      EXPIRED: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    const icons = {
      PENDING: <Clock className="h-3 w-3" />,
      USED: <CheckCircle className="h-3 w-3" />,
      REVOKED: <XCircle className="h-3 w-3" />,
      EXPIRED: <Calendar className="h-3 w-3" />,
    };

    return (
      <Badge className={`${variants[status as keyof typeof variants]} flex items-center gap-1`}>
        {icons[status as keyof typeof icons]}
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading && !invitations.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-medium text-slate-700">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-red-600" />
                <h1 className="text-2xl font-bold text-slate-900">Super Admin Portal</h1>
              </div>
              {profile && (
                <div className="text-sm text-slate-600">
                  Welcome, {profile.full_name}
                </div>
              )}
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-slate-200 hover:bg-slate-50"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200 text-red-800">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Hospital Invitations</h2>
            <p className="text-slate-600 mt-1">
              Manage and send invitations for hospital onboarding
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleCleanupExpired}
              variant="outline"
              className="border-slate-200 hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Cleanup Expired
            </Button>
            
            <Dialog open={showNewInviteModal} onOpenChange={setShowNewInviteModal}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  New Invitation
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Send Hospital Invitation</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="hospital@example.com"
                      value={newInviteData.email}
                      onChange={(e) => setNewInviteData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="expires">Expires in (days)</Label>
                    <Input
                      id="expires"
                      type="number"
                      min="1"
                      max="30"
                      value={newInviteData.expires_in_days}
                      onChange={(e) => setNewInviteData(prev => ({ ...prev, expires_in_days: parseInt(e.target.value) || 7 }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="draft">Hospital Draft (Optional JSON)</Label>
                    <Textarea
                      id="draft"
                      placeholder='{"hospital_name": "Example Hospital"}'
                      value={newInviteData.hospital_draft}
                      onChange={(e) => setNewInviteData(prev => ({ ...prev, hospital_draft: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowNewInviteModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateInvitation}
                      disabled={!newInviteData.email || isSending}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isSending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Invitation
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-slate-500" />
                <Label className="text-sm font-medium">Filter by status:</Label>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-slate-200 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="USED">Used</option>
                <option value="REVOKED">Revoked</option>
                <option value="EXPIRED">Expired</option>
              </select>
              <div className="text-sm text-slate-500">
                Total: {total} invitations
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invitations Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="h-5 w-5 mr-2" />
              Invitations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Used</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map((invitation) => (
                    <TableRow key={invitation.id}>
                      <TableCell className="font-medium">
                        {invitation.email}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(invitation.status)}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {formatDate(invitation.created_at)}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {formatDate(invitation.expires_at)}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {invitation.used_at ? formatDate(invitation.used_at) : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {invitation.hospital_draft && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              title="View Hospital Draft"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          {invitation.status === 'PENDING' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleRevokeInvitation(invitation.id)}
                              title="Revoke Invitation"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-slate-600">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {invitations.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <UserPlus className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No invitations found</h3>
                <p className="text-slate-600 mb-4">
                  {statusFilter ? 'No invitations match the current filter.' : 'Get started by creating your first hospital invitation.'}
                </p>
                {!statusFilter && (
                  <Button
                    onClick={() => setShowNewInviteModal(true)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Invitation
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
