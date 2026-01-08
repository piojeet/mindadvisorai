import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay secret not configured");
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase configuration missing");
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planType, userId, credits } = await req.json();

    console.log("Verifying payment:", { razorpay_order_id, planType, userId, credits });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new Error("Payment verification details missing");
    }

    if (!userId) {
      throw new Error("User ID is required");
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("Signature mismatch:", { expected: expectedSignature, received: razorpay_signature });
      throw new Error("Invalid payment signature");
    }

    console.log("Signature verified successfully");

    // Initialize Supabase client with service role key for admin access
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get current profile
    const { data: currentProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("credits, plan")
      .eq("id", userId)
      .single();

    if (fetchError) {
      console.error("Failed to fetch profile:", fetchError);
      throw new Error("Failed to fetch user profile");
    }

    console.log("Current profile:", currentProfile);

    // Prepare updates based on plan type
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (planType === "pro" || planType === "starter") {
      updates.plan = "pro";
      updates.subscription_active = true;
      updates.subscription_started_at = new Date().toISOString();
      updates.credits = (currentProfile?.credits || 0) + 200; // Pro plan adds 200 credits
      console.log("Upgrading to Pro plan with 200 credits");
    } else if (planType === "unlimited") {
      updates.plan = "unlimited";
      updates.subscription_active = true;
      updates.subscription_started_at = new Date().toISOString();
      updates.credits = 9999; // Unlimited credits
      console.log("Upgrading to Unlimited plan");
    } else if (planType === "credits" && credits) {
      // Credit purchase - add to existing credits
      updates.credits = (currentProfile?.credits || 0) + credits;
      console.log(`Adding ${credits} credits to existing ${currentProfile?.credits || 0}`);
    }

    console.log("Applying updates:", updates);

    const { data: updatedProfile, error: updateError } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (updateError) {
      console.error("Failed to update profile:", updateError);
      throw new Error("Failed to update user profile: " + updateError.message);
    }

    console.log("Profile updated successfully:", updatedProfile);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Payment verified and profile updated",
      paymentId: razorpay_payment_id,
      updatedProfile: {
        plan: updatedProfile.plan,
        credits: updatedProfile.credits,
        subscription_active: updatedProfile.subscription_active,
      },
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
