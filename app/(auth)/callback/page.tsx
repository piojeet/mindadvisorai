"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const finishAuth = async () => {
      // 🔑 This reads token from #
      await supabase.auth.getSession();

      // 🔥 REMOVE HASH COMPLETELY
      window.history.replaceState(null, "", "/dashboard");

      // 🚀 Redirect
      router.replace("/dashboard");
    };

    finishAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Signing you in...
    </div>
  );
}
