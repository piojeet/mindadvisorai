import CTA from "@/components/layout/CTA";
import FAQ from "@/components/layout/FAQ";
import Features from "@/components/layout/Features";
import Footer from "@/components/layout/Footer";
import HomeHero from "@/components/layout/HomeHero";
import HowItWorks from "@/components/layout/HowItWorks";
import NavBar from "@/components/layout/NavBar";
import Pricing from "@/components/layout/Pricing";
import Problem from "@/components/layout/Problem";
import RealLifeUseCases from "@/components/layout/RealLifeUseCases";
import WhoIsThis from "@/components/layout/WhoIsThis";

export default function Home() {
  return (
    <div>
      <NavBar />
      <HomeHero />
      <Problem />
      <WhoIsThis />
      <Features />
      <RealLifeUseCases />
      <HowItWorks />
      <FAQ />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}
