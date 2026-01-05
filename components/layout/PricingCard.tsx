import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type PricingCardProps = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
};

export default function PricingCard({
  name,
  price,
  period,
  description,
  features,
  highlighted = false,
}: PricingCardProps) {
  return (
    <Card
      className={`relative ${
        highlighted ? "border-primary shadow-glow scale-105" : ""
      }`}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
          Most Popular
        </div>
      )}

      <CardContent className="p-8">
        <h3 className="font-display font-bold text-xl mb-1">
          {name}
        </h3>

        <p className="text-sm text-muted-foreground mb-6">
          {description}
        </p>

        <div className="mb-6">
          <span className="font-display text-4xl font-bold">
            {price}
          </span>
          <span className="text-muted-foreground">
            {period}
          </span>
        </div>

        <ul className="space-y-3 mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* Button is now visual only (no JS) */}
        <Button
          variant={highlighted ? "hero" : "outline"}
          className="w-full"
          type="button"
        >
          Get Started
        </Button>
      </CardContent>
    </Card>
  );
}
