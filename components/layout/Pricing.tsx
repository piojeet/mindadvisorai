"use client"
import Link from "next/link";
import { Button } from "../ui/button";
// import PricingCard from "./PricingCard";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "../ui/card";
import { Check } from "lucide-react";

export default function Pricing() {
  const { user } = useAuth();
  const router = useRouter();

  const handlePricingSelect = () => {
    if (user) {
      router.push("/dashboard/profile");
    } else {
      router.push("/signup");
    }
  };

  return (
    <section id="pricing" className="py-20 px-6 bg-muted/30">
    <div className="md:container mx-auto max-w-5xl">
      <div className="text-center md:mb-16 mb-8">
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
          onSelect={handlePricingSelect}
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
          onSelect={handlePricingSelect}
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
          onSelect={handlePricingSelect}
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

const PricingCard = ({
  name,
  price,
  period,
  description,
  features,
  highlighted = false,
  onSelect,
}: {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  onSelect: () => void;
}) => (
  <Card className={`relative ${highlighted ? "border-primary shadow-glow scale-105" : ""}`}>
    {highlighted && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
        Most Popular
      </div>
    )}
    <CardContent className="p-8">
      <h3 className="font-display font-bold text-xl mb-1">{name}</h3>
      <p className="text-sm text-muted-foreground mb-6">{description}</p>
      <div className="mb-6">
        <span className="font-display text-4xl font-bold">{price}</span>
        <span className="text-muted-foreground">{period}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-primary flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button 
        variant={highlighted ? "hero" : "outline"} 
        className="w-full" 
        onClick={onSelect}
      >
        Get Started
      </Button>
    </CardContent>
  </Card>
);