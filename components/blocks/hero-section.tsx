"use client";

import { motion } from "motion/react";
import { useState } from "react";
import BlurText from "../ui/blur-text";
import { Button } from "../ui/button";

const HeroSection = () => {
  const [animationIndex, setAnimationIndex] = useState(0);

  return (
    <section className="w-full h-[90vh] min-h-[90vh] flex flex-col relative justify-start items-start max-w-[1800px] mx-auto p-5   pt-0 overflow-hidden ">
      <div className="w-full h-full relative  overflow-hidden">
        <motion.div
          className="w-full rounded-[20px] overflow-hidden absolute top-0 left-0 h-full opacity-30 z-1"
        >
          <video
            src="/videos/hero-section.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover rounded-[20px]"
          />
        </motion.div>

        <div className="w-[97%] md:w-[60%] mx-auto flex justify-center items-center h-full flex-col relative z-2">
          <div className="w-full min-h-[100px]">
            {animationIndex >= 0 && (
              <BlurText
                text="Raga — The Pathway for Afghanistan’s Tech Builders"
                delay={150}
                animateBy="words"
                direction="top"
                onAnimationComplete={() => {
                  setAnimationIndex(1);
                }}
                className="text-4xl lg:text-6xl font-extrabold mb-8 font-poppins justify-center "

              />
            )}
          </div>
          <div className="w-full min-h-[100px]">
            {animationIndex >= 1 && (
              <BlurText
                text="More than a workspace — Raga is a pathway for visionaries to build, connect, and shape the future of Afghanistan’s technology ecosystem."
                delay={50}
                animateBy="words"
                direction="top"
                onAnimationComplete={() => {
                  setAnimationIndex(2);
                }}
                className="text-base font-normal mb-8 justify-center"
               
              />
            )}
          </div>
        <div className="w-full min-h-[100px] flex justify-center items-center">
        {animationIndex >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              animate={{
                opacity: 1,
                y: 0,
                animationDuration: 0.5,
              }}
              
            >
              <Button
                variant={"secondary"}
                className="bg-black/80 py-6 px-7 cursor-pointer hover:bg-black"
              >
                Apply Now
              </Button>
            </motion.div>
          )}
        </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
