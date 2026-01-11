import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

export default function PricingFAQ() {
  return (
    <section className="py-20 px-6">
        <div className="md:container mx-auto max-w-3xl">
          <div className="text-center md:mb-16 mb-8">
            <h2 className="font-display text-3xl md:text-4xl font-bold">
            Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border rounded-xl px-6 bg-card">
              <AccordionTrigger className="text-left font-semibold">
              Can I cancel anytime?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
              Yes, you can cancel your subscription at any time. No questions asked.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-xl px-6 bg-card">
              <AccordionTrigger className="text-left font-semibold">
              What happens after my trial ends?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
              After your 10-day trial, you can choose a plan or continue with limited free features.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-xl px-6 bg-card">
              <AccordionTrigger className="text-left font-semibold">
              Do unused credits roll over?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
              Purchased credit packs never expire. Monthly plan credits reset each billing cycle.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-xl px-6 bg-card">
              <AccordionTrigger className="text-left font-semibold">
              Is my payment secure?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
              Yes, all payments are processed securely through Razorpay with bank-level encryption.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
  )
}
