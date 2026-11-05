import { Hero } from "@/components/home/Hero";
import { AboutSection } from "@/components/home/AboutSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ValuesSection } from "@/components/home/ValuesSection";
import { CtaBand } from "@/components/home/CtaBand";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <ServicesSection />
      <ValuesSection />
      <CtaBand />
    </>
  );
}
