"use client";
import HeroSection from "@/components/blocks/hero-section";
import ScrollReveal from "@/components/ui/text-scroll-reveal/text-scroll-reveal";
import { RagaTunnelLeft, RagaTunnelRight } from "@/icons/raga-tunnel";
import { motion } from "motion/react";
import Video from 'next-video';


export default function Home() {
  return (
    <div className="flex flex-col items-start justify-start h-screen">
      <HeroSection />

      <div className="min-h-fit w-full flex justify-center items-start -mt-[20px] z-0">
        <div className="flex justify-center items-start gap-4 w-[60%]">
          <RagaTunnelLeft className="" />
          <div className="w-[20%] flex self-stretch  flex-col justify-start items-center pt-[5%] ">
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{
                amount: "all",
                margin: "-90px",
              }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-normal w-full flex justify-center flex-nowrap text-nowrap"
            >
              More about
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 flex flex-col justify-center items-center font-extrabold text-4xl vertical-text"
            >
              RAGA
            </motion.h2>
          </div>

          <RagaTunnelRight className="" />
        </div>
      </div>

      <div className="bg-[#FAFAFA] w-full max-w-[1800px] mx-auto p-5 flex justify-start items-center gap-5">
        <div className="w-full flex flex-col justify-start items-start gap-1.5">
          <ScrollReveal
            baseOpacity={0}
            enableBlur={true}
            baseRotation={2}
            blurStrength={10}
            textClassName="justify-center text-center"
          >
            Raga is started by Engineer Reza Ahmadi with help of Afghanistan's
            people, the founder of Entop and the visionary behind Afghanistan’s
            first sports car. With his experience in pushing boundaries of
            innovation, he now aims to empower the next generation of Afghan
            talent. Through Raga, his goal is to give young engineers,
            designers, and creators the space and support they need to
            collaborate, build, and lead Afghanistan’s growth in technology.
          </ScrollReveal>

           <div className="w-[80%] aspect-video h-auto rounded-3xl overflow-hidden mx-auto"><Video src="/videos/guide-video.mp4"/></div>
        </div>
      </div>

      <div className="min-h-[800px] w-full ">hll</div>
    </div>
  );
}
