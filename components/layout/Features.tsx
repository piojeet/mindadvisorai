import { Brain, Shield, Target, TrendingUp, Users, Zap } from "lucide-react";
import FeatureCard from "./FeatureCard";

export default function Features() {
  return (
    <section id="features" className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Your Personal Growth Arsenal
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every feature is designed to help you grow mentally and professionally
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Brain}
              title="AI Mentor"
              description="Get personalized guidance for real-life problems. Not generic answers — real solutions."
              color="primary"
            />
            <FeatureCard
              icon={Target}
              title="Decision Lab"
              description="Simulate outcomes before you commit. See the impact of your decisions."
              color="secondary"
            />
            <FeatureCard
              icon={Zap}
              title="Daily Challenges"
              description="Build mental muscles with bite-sized thinking tasks and action items."
              color="primary"
            />
            <FeatureCard
              icon={TrendingUp}
              title="Growth Score"
              description="Track your cognitive progress over time. Watch yourself level up."
              color="secondary"
            />
            <FeatureCard
              icon={Users}
              title="Anonymous Community"
              description="Connect with like-minded thinkers. No social noise, just value."
              color="primary"
            />
            <FeatureCard
              icon={Shield}
              title="Private & Secure"
              description="Your thoughts are yours. Complete privacy, no data selling."
              color="secondary"
            />
          </div>
        </div>
      </section>
  )
}
