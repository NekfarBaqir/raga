import { ChevronDown } from "lucide-react";
import Image from "next/image";

const HeroSectionV2 = () => {
  return (
    <section className="w-full min-h-screen h-auto relative pointer-events-none overflow-visible">
      <Image
        src="/images/hero-section-bg.png"
        alt="Hero Section bg"
        fill
        className="object-cover"
      />
      <div className="w-full h-full inset-0 absolute bg-gradient-to-b from-background/20 via-background/50 to-background/100"></div>
   
      <div className="w-full absolute z-[500] pb-3 bottom-0 flex justify-center items-center">
        <button className="cursor-pointer pointer-events-auto"><ChevronDown className="w-7 h-7 animate-bounce" /></button>
      </div>
    </section>
  );
};

export default HeroSectionV2;
