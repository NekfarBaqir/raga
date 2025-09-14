"use client";
import { motion } from "motion/react";
import CornerCroppedButton from "../ui/corner-cropped-button";
import Player from "../ui/player/player";

const WhatWeDoSection = () => {
  return (
    <section className="relative w-full flex flex-col md:flex-row justify-start items-start h-fit overflow-hidden max-w-[1800px] mx-auto px-12 md:px-16 lg:px-20 gap-10 py-10">
      <div className="w-full md:w-[40%] self-stretch relative flex flex-col justify-start items-start gap-10 pb-[4%] ">
        <motion.h2
          initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-2xl md:text-5xl font-bold font-poppins"
        >
          WHAT WE <span className="block">DO?</span>
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-sm md:text-lg flex flex-col justify-start items-start gap-3"
        >
          At Raga, you'll find everything needed to focus on building:
          <ul className="text-sm list-disc pl-[5%]">
            <li>24/7 reliable power & fast internet for uninterrupted work.</li>
            <li>A modern workspace with room for 16 innovators at a time.</li>
            <li>
              Team-friendly setup — tea pots, kitchen, and facilities for long
              sessions.
            </li>
            <li>Community support from like-minded creators and mentors.</li>
          </ul>
          We don't take equity. We don't charge rent. Our goal is to give you
          the freedom to create.
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full flex justify-end items-end"
        >
          {" "}
          <CornerCroppedButton link="/apply">Apply Now</CornerCroppedButton>
        </motion.div>
      </div>

      <div className="w-full md:w-[60%] flex justify-end items-center">
        <div className="w-full md:w-[90%] self-stretch flex justify-center items-center">
        <Player />
        </div>
      </div>

      <span className="absolute top-0 left-0 text-xs md:text-sm font-light px-12 md:px-16 lg:px-20 uppercase">
        A launchpad for innovation.
      </span>
    </section>
  );
};

export default WhatWeDoSection;
