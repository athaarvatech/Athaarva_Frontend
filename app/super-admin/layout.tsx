"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Shield, Menu, X, Bell, LogOut } from 'lucide-react';
import { SuperAdminAuthProvider, useSuperAdminAuth } from '@/contexts/SuperAdminAuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/super-admin', exact: true },
  { label: 'Tenants', href: '/super-admin/tenants' },
  { label: 'Users', href: '/super-admin/users' },
  { label: 'Invitations', href: '/super-admin/invites' },
  { label: 'Plans', href: '/super-admin/plans' },
  { label: 'Database', href: '/super-admin/database' },
  { label: 'Audit Logs', href: '/super-admin/audit-logs' },
  { label: 'Settings', href: '/super-admin/settings' },
  { label: 'Impersonate', href: '/super-admin/impersonate' },
  { label: 'Jobs', href: '/super-admin/jobs' },
  { label: 'AI', href: '/super-admin/ai' },
  { label: 'Templates', href: '/super-admin/templates' },
  { label: 'Website', href: '/super-admin/website' },
  { label: 'Social', href: '/super-admin/social' },
];

function SuperAdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isAuthenticated, logout } = useSuperAdminAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const isAuthRoute = pathname?.includes('/super-admin/login');

  useEffect(() => {
    if (isAuthRoute) {
      return;
    }

    if (!loading && !isAuthenticated) {
      router.replace('/super-admin/login');
    }
  }, [isAuthRoute, loading, isAuthenticated, router]);

  const activeHref = useMemo(() => {
    return NAV_ITEMS.find((item) =>
      item.href !== '#'
        ? item.exact
          ? pathname === item.href
          : pathname?.startsWith(item.href)
        : false
    )?.href;
  }, [pathname]);

  const handleLogout = () => {
    logout();
  };

  if (isAuthRoute) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 text-white/80">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm tracking-wide uppercase">Preparing super admin workspace…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="border-b border-white/5 bg-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-red-600/90">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/70">Athaarva Platform</p>
                <h1 className="text-xl font-semibold">Super Admin Workspace</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-white/80 hover:text-white">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-medium">{user?.full_name || 'Super Admin'}</span>
                <span className="text-xs text-white/70">{user?.email}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-white/30 text-white/80 hover:text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="sm:hidden"
              >
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <nav className="border-b border-white/5 bg-slate-900/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={cn('flex flex-wrap gap-2 py-3', isSidebarOpen ? 'block' : 'hidden sm:flex')}>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href === '#' ? '#' : item.href}
                aria-disabled={item.disabled}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-full border border-transparent transition',
                  item.disabled && 'opacity-40 cursor-not-allowed',
                  activeHref === item.href
                    ? 'bg-white text-slate-900'
                    : 'text-white/80 hover:text-white hover:border-white/30'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>
    </div>
  );
}

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SuperAdminAuthProvider>
      <SuperAdminLayoutContent>{children}</SuperAdminLayoutContent>
    </SuperAdminAuthProvider>
  );
}
