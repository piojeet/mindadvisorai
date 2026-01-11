import CreditPacks from "@/components/layout/CreditPacks";
import Footer from "@/components/layout/Footer";
import NavBar from "@/components/layout/NavBar";
import PriceCTA from "@/components/layout/PriceCTA";
import PricingFAQ from "@/components/layout/PricingFAQ";
import PricingHero from "@/components/layout/PricingHero";
import PricingSelect from "@/components/layout/PricingSelect";

export default function Price() {
  return (
    <div>
        <NavBar />
        <PricingHero />
        <PricingSelect />
        <CreditPacks />
        <PricingFAQ />
        <PriceCTA />
        <Footer />
    </div>
  )
}
