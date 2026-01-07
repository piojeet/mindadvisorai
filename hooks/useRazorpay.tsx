import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface PaymentOptions {
  amount: number;
  planType: "pro" | "unlimited" | "credits";
  credits?: number;
  userId?: string;
  userEmail?: string;
  userName?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useRazorpay = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const { toast } = useToast();

  // Load Razorpay script
  useEffect(() => {
    if (typeof window !== "undefined" && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setIsScriptLoaded(true);
      script.onerror = () => {
        console.error("Failed to load Razorpay script");
        toast({
          title: "Payment Error",
          description: "Failed to load payment system. Please refresh and try again.",
          variant: "destructive",
        });
      };
      document.body.appendChild(script);
    } else if (window.Razorpay) {
      setIsScriptLoaded(true);
    }
  }, [toast]);

  const initiatePayment = useCallback(async (options: PaymentOptions) => {
    if (!isScriptLoaded) {
      toast({
        title: "Please wait",
        description: "Payment system is loading...",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create order
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        "create-razorpay-order",
        {
          body: {
            amount: options.amount,
            planType: options.planType,
            userId: options.userId,
          },
        }
      );

      if (orderError || !orderData) {
        throw new Error(orderError?.message || "Failed to create order");
      }

      const razorpayOptions: RazorpayOptions = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "MindForge",
        description: options.planType === "credits" 
          ? `Purchase ${options.credits} Credits` 
          : `${options.planType.charAt(0).toUpperCase() + options.planType.slice(1)} Plan`,
        order_id: orderData.orderId,
        handler: async (response: RazorpayResponse) => {
          try {
            // Verify payment
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
              "verify-razorpay-payment",
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  planType: options.planType,
                  userId: options.userId,
                  credits: options.credits,
                },
              }
            );

            if (verifyError || !verifyData?.success) {
              throw new Error(verifyError?.message || "Payment verification failed");
            }

            toast({
              title: "Payment Successful!",
              description: options.planType === "credits"
                ? `${options.credits} credits added to your account.`
                : `You've been upgraded to the ${options.planType} plan!`,
            });

            options.onSuccess?.();
          } catch (error) {
            console.error("Payment verification error:", error);
            options.onError?.(error instanceof Error ? error.message : "Verification failed");
            toast({
              title: "Verification Error",
              description: "Payment received but verification failed. Please contact support.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: options.userName,
          email: options.userEmail,
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(razorpayOptions);
      razorpay.open();
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to initiate payment",
        variant: "destructive",
      });
      options.onError?.(error instanceof Error ? error.message : "Payment failed");
    } finally {
      setIsLoading(false);
    }
  }, [isScriptLoaded, toast]);

  return { initiatePayment, isLoading, isScriptLoaded };
};
