import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

export default function PriceCTA() {
  return (
    <section className="py-20 px-6 bg-primary text-primary-foreground">
    <div className="md:container mx-auto max-w-3xl text-center">
      <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
      Start Your Free Trial Today
      </h2>
      <p className="text-xl opacity-90 mb-10">
      No credit card required. Full access for 10 days.
      </p>
      <Button variant="amber" size="xl" 
    //   onClick={handleGetStarted}
      >
        Get Started Free
        <ArrowRight className="w-5 h-5" />
      </Button>
    </div>
  </section>
  )
}
