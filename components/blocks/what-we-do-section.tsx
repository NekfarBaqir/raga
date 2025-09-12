import { motion } from "motion/react";
import Video from "next-video";
import CornerCroppedButton from "../ui/corner-cropped-button";

const WhatWeDoSection = () => {
  return (
    <section className="relative w-full flex justify-start items-start h-fit overflow-hidden max-w-[1800px] mx-auto px-12 md:px-16 lg:px-20 gap-10 py-10  ">
      <div className="w-[40%] self-stretch relative flex flex-col justify-start items-start gap-10 pb-[4%] ">
        <motion.h2
          initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl font-bold font-poppins"
        >
          WHAT WE <span className="block">DO?</span>
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-lg flex flex-col justify-start items-start gap-3"
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

      <div className="w-[60%] flex justify-end items-center">
        <div className="w-[90%] self-stretch flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative  aspect-[621/418] w-full"
          >
               <Video src="/videos/guide-video.mp4"  className="w-full h-full"/>
          </motion.div>
        </div>
      </div>

      <span className="absolute top-0 left-0 text-sm font-light px-12 md:px-16 lg:px-20 uppercase">
        A launchpad for innovation.
      </span>
    </section>
  );
};

export default WhatWeDoSection;
