import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "../ui/button";

export default function HomeHero() {
  return (
    <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto max-w-5xl relative">
          <div className="text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Decision Intelligence</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
              Think Better.
              <br />
              <span className="text-gradient">Decide Faster.</span>
              <br />
              Grow Daily.
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Stop overthinking. Start growing. MindForge uses AI to help you make smarter decisions, 
              build mental clarity, and unlock your potential — one day at a time.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl" >
                Start Free (10 Days)
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="hero-outline" size="xl" >
                See How It Works
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Hindi + English</span>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}
