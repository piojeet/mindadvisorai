"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  goals: string[];
  plan: "free" | "pro";
  credits: number;
  trial_ends_at: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      // ✅ FIX 1: real error only
      if (fetchError && Object.keys(fetchError).length > 0) {
        throw fetchError;
      }

      // ✅ FIX 2: NEW USER → no profile yet
      if (!data) {
        setProfile(null);
        return;
      }

      // ✅ FIX 3: normalize DB data
      const profileData = data as Profile & { onboarding_completed?: boolean };
      setProfile({
        ...data,
        goals: data.goals ?? [],
        plan: (data.plan as "free" | "pro") ?? "free",
        credits: data.credits ?? 0,
        onboarding_completed: profileData.onboarding_completed ?? false,
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch profile"
      );
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates: {
    name?: string;
    goals?: string[];
    onboarding_completed?: boolean;
  }) => {
    if (!user) {
      return { error: new Error("Not authenticated") };
    }

    try {
      const updateData: {
        name?: string;
        goals?: string[];
        onboarding_completed?: boolean;
      } = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.goals !== undefined) updateData.goals = updates.goals;
      if (updates.onboarding_completed !== undefined) updateData.onboarding_completed = updates.onboarding_completed;

      const { data, error: updateError } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id)
        .select()
        .single();

      // Only treat this as a real error if Supabase actually returned details
      if (updateError && Object.keys(updateError).length > 0) {
        throw updateError;
      }

      if (data) {
        const profileData = data as Profile & { onboarding_completed?: boolean };
        setProfile({
          ...data,
          goals: data.goals ?? [],
          plan: (data.plan as "free" | "pro") ?? "free",
          credits: data.credits ?? 0,
          onboarding_completed: profileData.onboarding_completed ?? false,
        });
      }

      return { error: null };
    } catch (err) {
      // Log a richer error shape to aid debugging
      console.error("Error updating profile:", {
        message: err instanceof Error ? err.message : "Unknown error",
        raw: err,
      });
      return {
        error:
          err instanceof Error
            ? err
            : new Error("Failed to update profile"),
      };
    }
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refreshProfile: fetchProfile,
  };
};
