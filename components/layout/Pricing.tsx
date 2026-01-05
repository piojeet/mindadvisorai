import Link from "next/link";
import { Button } from "../ui/button";
import PricingCard from "./PricingCard";

export default function Pricing() {

    // const handlePricingSelect = () => {
    //     if (user) {
    //       navigate("/dashboard/profile");
    //     } else {
    //       navigate("/signup");
    //     }
    //   };

  return (
    <section id="pricing" className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Start free. Upgrade when you&apos;re ready.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard
              name="Starter"
              price="₹299"
              period="/month"
              description="Perfect to get started"
              features={[
                "50 AI Mentor credits/month",
                "5 Decision Lab simulations",
                "Daily challenges",
                "Growth tracking",
              ]}
            //   onSelect={handlePricingSelect}
            />
            <PricingCard
              name="Pro"
              price="₹699"
              period="/month"
              description="For serious growth"
              features={[
                "200 AI Mentor credits/month",
                "Unlimited Decision Lab",
                "Priority support",
                "Advanced analytics",
                "Community access",
              ]}
              highlighted
            //   onSelect={handlePricingSelect}
            />
            <PricingCard
              name="Unlimited"
              price="₹1,499"
              period="/month"
              description="Maximum power"
              features={[
                "Unlimited AI Mentor",
                "Unlimited Decision Lab",
                "1-on-1 onboarding call",
                "Custom growth plans",
                "Early feature access",
              ]}
            //   onSelect={handlePricingSelect}
            />
          </div>

          <div className="text-center mt-8">
            <Button variant="ghost" asChild>
              <Link href="/pricing">View Full Pricing Details</Link>
            </Button>
          </div>
        </div>
      </section>
  )
}
