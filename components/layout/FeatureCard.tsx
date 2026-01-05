import React from "react";
import { Card, CardContent } from "@/components/ui/card";

type FeatureCardProps = {
  icon: React.ElementType;
  title: string;
  description: string;
  color: "primary" | "secondary";
};

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
}: FeatureCardProps) {
  return (
    <Card className="card-hover group">
      <CardContent className="p-6">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
            color === "primary" ? "bg-primary/10" : "bg-secondary/10"
          }`}
        >
          <Icon
            className={`w-6 h-6 ${
              color === "primary" ? "text-primary" : "text-secondary"
            }`}
          />
        </div>

        <h3 className="font-display font-semibold text-lg mb-2">
          {title}
        </h3>

        <p className="text-muted-foreground text-sm">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
