import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

export default function CTA() {
  return (
    <section className="py-20 px-6 bg-primary text-primary-foreground">
    <div className="md:container mx-auto max-w-3xl text-center">
      <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
        Ready to Think Better?
      </h2>
      <p className="text-xl opacity-90 mb-10">
        Join thousands of Indians building mental clarity and making smarter decisions daily.
      </p>
      <Button variant="amber" size="xl" 
    //   onClick={handleGetStarted}
      >
        Start Your Free Trial
        <ArrowRight className="w-5 h-5" />
      </Button>
    </div>
  </section>
  )
}
