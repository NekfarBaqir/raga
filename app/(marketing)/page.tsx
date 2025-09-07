import AboutRagaSection from "@/components/blocks/about-raga-section";
import HeroSection from "@/components/blocks/hero-section";
import WhoCanJoinSection from "@/components/blocks/who-can-join-section";
import WhyRagaSection from "@/components/blocks/why-raga-section";
import LeftsideSpeaker from "@/components/blocks/Speaker-left-side";
import RightsideSpeaker from "@/components/blocks/Speaker-right-side";

export default function Home() {
  return (
    <div className="flex flex-col items-start justify-start h-screen">
      <HeroSection />
      <AboutRagaSection />
      <WhyRagaSection />
      <LeftsideSpeaker />
      <RightsideSpeaker />
      <WhoCanJoinSection />
    </div>
  );
}
