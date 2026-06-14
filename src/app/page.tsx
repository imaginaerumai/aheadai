import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PathsOverview from "@/components/PathsOverview";
import Features from "@/components/Features";
import PricingSection from "@/components/PricingSection";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PathsOverview />
        <Features />
        <PricingSection />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
