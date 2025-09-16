"use client";
import { motion } from "motion/react";
import Image from "next/image";
import CornerCroppedButton from "../ui/corner-cropped-button";

const WhatWeDoSection = () => {
  return (
    <section className="relative w-full flex flex-col md:flex-row justify-start items-start h-fit overflow-hidden max-w-[1440px] mx-auto px-12 md:px-16 lg:px-20 gap-10 py-10">
      <div className="flex-1 w-full md:w-[60%] flex justify-end items-center">
      <div className="w-full  self-stretch relative flex flex-col justify-start items-start gap-10 pb-[4%] ">
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
          <p>
            At Raga, you’ll step into a thoughtfully designed environment that keeps
            you in flow. Reliable 24/7 power and fast internet ensure your momentum
            never stalls, while a modern workspace comfortably supports up to sixteen
            builders at a time. The space is team-friendly too, with tea pots, a small
            kitchen, and the comforts needed for long, focused sessions—surrounded by a
            community of like‑minded creators and mentors who are ready to help when you
            need it.
          </p>
          <p>
            We don’t take equity. We don’t charge rent. Our only goal is to give you
            the freedom to create.
          </p>
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
      </div>

      <div className="w-full md:w-[40%]  flex justify-end items-center">
      <motion.div
          initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative  aspect-[424/618] h-[300px] md:h-[618px] w-auto"
        >
          <Image
            src={"/images/why.jpg"}
            alt="coworking space"
            className="object-cover"
            loading="lazy"
            fill
          />
        </motion.div>
      </div>


    </section>
  );
};

export default WhatWeDoSection;
