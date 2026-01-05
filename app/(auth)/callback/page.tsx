"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const finishAuth = async () => {
      await supabase.auth.getSession();

      // ✅ REMOVE HASH COMPLETELY
      window.history.replaceState(null, "", "/dashboard");

      router.replace("/dashboard");
    };

    finishAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Signing you in…</p>
    </div>
  );
}
