"use client";
import FAQSection from "@/components/blocks/faq-section";
import HeroSectionV2 from "@/components/blocks/hero-section-v2";
import SloganSection from "@/components/blocks/slogan-section";
import WhatWeDoSection from "@/components/blocks/what-we-do-section";
import WhoCanJoinUS from "@/components/blocks/who-can-join-section";
import WhyWeDotItSection from "@/components/blocks/why-we-do-it-section";

export default function Home() {
  return (
    <div className="flex flex-col items-start justify-start min-h-screen gap-20 md:gap-24 lg:gap-32 xl:gap-40 overflow-y-auto">
      <HeroSectionV2 />
      <SloganSection />
      <WhyWeDotItSection />
      <WhatWeDoSection />
      <WhoCanJoinUS />
      {/* <OurPartnersSection /> */}
      <FAQSection />
    </div>
  );
}
