import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export default function RealLifeUseCases() {

    // const handleTryScenario = () => {
    //     if (user) {
    //       navigate("/dashboard/decision-lab");
    //     } else {
    //       navigate("/signup");
    //     }
    //   };

  return (
    <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Real-Life Use Cases
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how MindForge helps in everyday situations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="text-3xl mb-4">🤔</div>
                <h3 className="font-display font-semibold text-lg mb-2">Career Decision Confusion</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  &quot;Should I take this new job offer? Should I switch industries? Is this the right time for an MBA?&quot;
                  MindForge helps you weigh options and see long-term outcomes.
                </p>
                <Button variant="outline" >
                  Try This Scenario
                </Button>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="text-3xl mb-4">💡</div>
                <h3 className="font-display font-semibold text-lg mb-2">Business Idea Validation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  &quot;Is my startup idea worth pursuing? What could go wrong? How should I prioritize?&quot;
                  Simulate outcomes before investing time and money.
                </p>
                <Button variant="outline" >
                  Try This Scenario
                </Button>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="text-3xl mb-4">🧠</div>
                <h3 className="font-display font-semibold text-lg mb-2">Overthinking & Mental Clarity</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  &quot;I keep going in circles. I can&apos;t decide. My mind feels foggy.&quot;
                  Get structured thinking frameworks to cut through the noise.
                </p>
                <Button variant="outline" >
                  Try This Scenario
                </Button>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="text-3xl mb-4">⚡</div>
                <h3 className="font-display font-semibold text-lg mb-2">Daily Productivity Struggles</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  &quot;I waste hours scrolling. I can&apos;t focus. I procrastinate important tasks.&quot;
                  Build better habits with daily challenges and accountability.
                </p>
                <Button variant="outline" >
                  Try This Scenario
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
  )
}
