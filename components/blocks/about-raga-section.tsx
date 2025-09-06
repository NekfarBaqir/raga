"use client"
import { RagaTunnelLeft, RagaTunnelRight } from "@/icons/raga-tunnel";
import { motion } from "motion/react";
import Video from 'next-video';
import ScrollReveal from "../ui/text-scroll-reveal/text-scroll-reveal";

const AboutRagaSection = () => {
  return (
   <>
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

      <div className="bg-[#FAFAFA] dark:bg-white/5 w-full max-w-[1800px] mx-auto p-5 flex justify-start items-center gap-5 py-20">
        <div className="w-full flex flex-col justify-start items-start gap-1.5">
          <ScrollReveal
            baseOpacity={0}
            enableBlur={true}
            baseRotation={2}
            blurStrength={10}
            textClassName="justify-center text-center"
          >
            Founded by visionary engineer Reza Ahmadi, creator of Entop and pioneer behind Afghanistan's first sports car, Raga represents a bold leap forward in our nation's technological evolution. Drawing from years of groundbreaking innovation, Reza has created more than just a workspace—he's built a launchpad for Afghanistan's most ambitious minds. At Raga, talented engineers, creative designers, and forward-thinking entrepreneurs find the resources, community, and inspiration they need to transform ideas into reality and drive Afghanistan's digital renaissance.
          </ScrollReveal>

           <div className="w-[80%] aspect-video h-auto rounded-3xl overflow-hidden mx-auto"><Video src="/videos/guide-video.mp4"/></div>
        </div>
      </div></>
  )
}

export default AboutRagaSection
