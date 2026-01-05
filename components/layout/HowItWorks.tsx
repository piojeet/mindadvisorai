import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              How MindAdvisorAi Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Start growing in just 5 minutes a day
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Quick Setup", desc: "Tell us your goals and daily availability" },
              { step: "02", title: "Get Your Plan", desc: "AI creates your personalized growth path" },
              { step: "03", title: "Daily Practice", desc: "Complete challenges and use the AI mentor" },
              { step: "04", title: "Track Growth", desc: "Watch your decision-making improve" },
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="font-display font-bold text-primary text-xl">{item.step}</span>
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
                {i < 3 && (
                  <ChevronRight className="hidden md:block absolute top-8 -right-4 w-8 h-8 text-muted-foreground/30" />
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" asChild>
              <Link href="/how-it-works">
                Learn More About Our Process
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
  )
}
