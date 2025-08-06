"use client";

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FullPageLoader } from '@/components/ui/SimpleLoader';

interface RouteGuardProps {
  children: React.ReactNode;
}

// Optimized public route guard with faster redirects
export function PublicRouteGuard({ children }: RouteGuardProps) {
  const { isAuthenticated, loading, isOnboardingCompleted, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      // Fast redirect logic
      const redirectTo = !isOnboardingCompleted 
        ? `/onboarding/${user.user_type}` 
        : `/${user.user_type}/dashboard`;
      
      router.replace(redirectTo);
    }
  }, [isAuthenticated, loading, isOnboardingCompleted, user, router]);

  if (loading) {
    return <FullPageLoader message="Checking authentication..." />;
  }

  if (isAuthenticated) {
    return <FullPageLoader message="Redirecting..." />;
  }

  return <>{children}</>;
}

// Optimized protected route guard
export function ProtectedRouteGuard({ children }: RouteGuardProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/auth');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <FullPageLoader message="Verifying access..." />;
  }

  if (!isAuthenticated) {
    return <FullPageLoader message="Redirecting to login..." />;
  }

  return <>{children}</>;
}

// Optimized role-based route guard
export function RoleBasedRouteGuard({ 
  children, 
  allowedRoles 
}: RouteGuardProps & { allowedRoles: string[] }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      if (!allowedRoles.includes(user.user_type)) {
        router.replace(`/${user.user_type}/dashboard`);
      }
    }
  }, [user, isAuthenticated, loading, allowedRoles, router]);

  if (loading) {
    return <FullPageLoader message="Checking permissions..." />;
  }

  if (!isAuthenticated || !user || !allowedRoles.includes(user.user_type)) {
    return <FullPageLoader message="Redirecting..." />;
  }

  return <>{children}</>;
}

// Optimized onboarding route guard
export function OnboardingRouteGuard({ children }: RouteGuardProps) {
  const { isAuthenticated, loading, isOnboardingCompleted, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace('/auth');
        return;
      }

      if (isOnboardingCompleted) {
        router.replace(`/${user?.user_type}/dashboard`);
        return;
      }

      // Optimize path checking
      const correctPath = `/onboarding/${user?.user_type}`;
      if (pathname !== correctPath) {
        router.replace(correctPath);
      }
    }
  }, [isAuthenticated, loading, isOnboardingCompleted, user, router, pathname]);

  if (loading) {
    return <FullPageLoader message="Loading..." />;
  }

  if (!isAuthenticated || isOnboardingCompleted) {
    return <FullPageLoader message="Redirecting..." />;
  }

  return <>{children}</>;
}

// Optimized dashboard route guard
export function DashboardRouteGuard({ 
  children, 
  userType 
}: RouteGuardProps & { userType: 'doctor' | 'patient' }) {
  const { isAuthenticated, loading, isOnboardingCompleted, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace('/auth');
        return;
      }

      if (!isOnboardingCompleted) {
        router.replace(`/onboarding/${user?.user_type}`);
        return;
      }

      if (user?.user_type !== userType) {
        router.replace(`/${user?.user_type}/dashboard`);
        return;
      }
    }
  }, [isAuthenticated, loading, isOnboardingCompleted, user, userType, router]);

  if (loading) {
    return <FullPageLoader message="Loading dashboard..." />;
  }

  if (!isAuthenticated || !isOnboardingCompleted || user?.user_type !== userType) {
    return <FullPageLoader message="Redirecting..." />;
  }

  return <>{children}</>;
}
