"use client";

import type React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, token, isLoading, fetchProfile, initialize } =
    useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Initialize auth state on mount
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Only redirect after loading is complete
    if (!isLoading) {
      if (!isAuthenticated || !token) {
        router.push("/auth/login");
        return;
      }

      // Fetch profile if authenticated but no user data
      const { user } = useAuthStore.getState();
      if (!user) {
        fetchProfile().catch(() => {
          router.push("/auth/login");
        });
      }
    }
  }, [isAuthenticated, token, isLoading, router, fetchProfile]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading if not authenticated (will redirect)
  if (!isAuthenticated || !token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
