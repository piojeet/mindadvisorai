"use client"
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useRazorpay } from "@/hooks/useRazorpay";
import { useProfile } from "@/hooks/useProfile";

export default function PricingSelect() {
    const { user } = useAuth();
  const { profile, refreshProfile } = useProfile();
  const { initiatePayment, isLoading: isPaymentLoading } = useRazorpay();
  const { toast } = useToast();
  const router = useRouter();

    const handlePlanSelect = (planType: "starter" | "pro" | "unlimited", amount: number) => {
        if (!user) {
            router.push("/signup");
          return;
        }
    
        initiatePayment({
          amount,
          planType: planType === "starter" ? "pro" : planType,
          userId: user.id,
          userEmail: user.email || undefined,
          userName: profile?.name || undefined,
          onSuccess: () => {
            refreshProfile();
            router.push("/dashboard/profile");
          },
          onError: (error) => {
            toast({
              title: "Payment Failed",
              description: error,
              variant: "destructive",
            });
          },
        });
      };

    const plans = [
        {
          name: "Starter",
          price: "₹299",
          amount: 299,
          period: "/month",
          description: "Perfect to get started",
          planType: "starter" as const,
          features: [
            "50 AI Mentor credits/month",
            "5 Decision Lab simulations",
            "Daily challenges",
            "Growth tracking",
          ],
          highlighted: false,
        },
        {
          name: "Pro",
          price: "₹699",
          amount: 699,
          period: "/month",
          description: "For serious growth",
          planType: "pro" as const,
          features: [
            "200 AI Mentor credits/month",
            "Unlimited Decision Lab",
            "Priority support",
            "Advanced analytics",
            "Community access",
          ],
          highlighted: true,
        },
        {
          name: "Unlimited",
          price: "₹1,499",
          amount: 1499,
          period: "/month",
          description: "Maximum power",
          planType: "unlimited" as const,
          features: [
            "Unlimited AI Mentor",
            "Unlimited Decision Lab",
            "1-on-1 onboarding call",
            "Custom growth plans",
            "Early feature access",
          ],
          highlighted: false,
        },
      ];

  return (
    <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <Card key={i} className={`relative ${plan.highlighted ? "border-primary shadow-glow scale-105" : ""}`}>
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="font-display font-bold text-xl mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="font-display text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant={plan.highlighted ? "hero" : "outline"} 
                    className="w-full"
                    onClick={() => handlePlanSelect(plan.planType, plan.amount)}
                    disabled={isPaymentLoading}
                  >
                    {isPaymentLoading ? "Processing..." : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
  )
}
