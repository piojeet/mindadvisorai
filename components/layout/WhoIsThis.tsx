"use client"
import { Briefcase, GraduationCap, Palette, Rocket } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export default function WhoIsThis() {

    const scrollToHowItWorks = () => {
        const element = document.getElementById("how-it-works");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };

  return (
    <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Who Is This For?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              MindAdvisorAi is built for anyone who wants to think clearer and make better decisions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="card-hover group cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110">
                  <GraduationCap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">Students</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Navigate career choices, exam stress, and life decisions with clarity
                </p>
                <Button variant="outline" size="sm" onClick={scrollToHowItWorks}>
                  See How It Helps
                </Button>
              </CardContent>
            </Card>

            <Card className="card-hover group cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110">
                  <Briefcase className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">Professionals</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Handle workplace challenges, promotions, and work-life balance better
                </p>
                <Button variant="outline" size="sm" onClick={scrollToHowItWorks}>
                  See How It Helps
                </Button>
              </CardContent>
            </Card>

            <Card className="card-hover group cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110">
                  <Rocket className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">Founders</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Validate ideas, make tough business calls, and stay focused
                </p>
                <Button variant="outline" size="sm" onClick={scrollToHowItWorks}>
                  See How It Helps
                </Button>
              </CardContent>
            </Card>

            <Card className="card-hover group cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110">
                  <Palette className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">Creators</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Overcome creative blocks, plan content strategy, and grow sustainably
                </p>
                <Button variant="outline" size="sm" onClick={scrollToHowItWorks}>
                  See How It Helps
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
  )
}
