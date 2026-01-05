import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

export default function FAQ() {
  return (
    <section className="py-20 px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Why MindForge Is Different
            </h2>
            <p className="text-lg text-muted-foreground">
              A deep dive into what sets us apart
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border rounded-xl px-6 bg-card">
              <AccordionTrigger className="text-left font-semibold">
                Structured Thinking vs Generic AI
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                While ChatGPT gives you an answer, MindForge gives you a framework. We use proven 
                decision-making models like First Principles, Weighted Scoring, and Regret Minimization 
                to help you think through problems systematically. You don&apos;t just get answers — you 
                learn how to think better.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-xl px-6 bg-card">
              <AccordionTrigger className="text-left font-semibold">
                Decision Simulation vs Motivation Quotes
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Most self-improvement apps give you inspirational quotes and hope for the best. 
                MindForge lets you simulate decisions before you make them. See potential outcomes, 
                identify risks, and understand trade-offs. It&apos;s like having a crystal ball for 
                your life choices.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-xl px-6 bg-card">
              <AccordionTrigger className="text-left font-semibold">
                Growth Score vs Streak-Only Apps
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Streaks can be gamified and don&apos;t always mean progress. Our Growth Score measures 
                actual cognitive improvement — your decision quality, thinking speed, and clarity 
                over time. It&apos;s not about showing up daily; it&apos;s about genuinely improving.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-xl px-6 bg-card">
              <AccordionTrigger className="text-left font-semibold">
                Credit-Based Usage vs Unlimited Spam
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Unlimited access sounds great until you realize it encourages mindless usage. 
                Our credit system encourages thoughtful, intentional use. You&apos;ll think before 
                you ask, making each interaction more valuable. Quality over quantity.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
  )
}
