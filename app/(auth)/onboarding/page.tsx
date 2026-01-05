"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Onboarding from "@/components/layout/Onboarding";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();

  useEffect(() => {
    // ❌ Not logged in → login
    if (!authLoading && !user) {
      router.replace("/login");
      return;
    }

    // ✅ Logged in but already onboarded → dashboard
    if (!profileLoading && profile?.onboarding_completed) {
      router.replace("/dashboard");
      return;
    }
  }, [user, profile, authLoading, profileLoading, router]);

  // ⏳ Loading state (important to avoid flicker)
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ✅ Only NEW + LOGGED-IN users reach here
  return <Onboarding />;
}
