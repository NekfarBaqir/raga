import AboutRagaSection from "@/components/blocks/about-raga-section";
import HeroSection from "@/components/blocks/hero-section";
import WhoCanJoinSection from "@/components/blocks/who-can-join-section";
import WhyRagaSection from "@/components/blocks/why-raga-section";

export default function Home() {
  return (
    <div className="flex flex-col items-start justify-start h-screen">
      <HeroSection />
      <AboutRagaSection />
      <WhyRagaSection />

      <WhoCanJoinSection />
    </div>
  );
}
