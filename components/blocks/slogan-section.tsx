"use client";

import ExtendedLogo from "@/icons/extended-logo";
import { motion } from "motion/react";

const SloganSection = () => {
  return (
    <div className="w-full h-fit overflow-visible -mt-[80vh]  md:-mt-[65vh] ">
      <section className="w-[94%] aspect-[1361/2800] md:aspect-[1361/984] h-auto relative mx-auto  flex">
        <ExtendedLogo className="object-contain w-full h-fit absolute" />
        <div className="relative self-stretch w-full md:w-[94%]   flex justify-start items-start max-w-[1320px] mx-auto">
          <div className="self-stretch w-[50%] flex flex-col justify-start pt-[35%] md:pt-0 md:justify-center items-center">
            <motion.div
              initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              viewport={{ amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <blockquote className="text-base md:text-xl lg:text-3xl font-bold w-full pr-[15%] md:pr-0  md:w-[70%] lg:w-[60%] mx-auto font-poppins">
                "Find a group of people who challenge and inspire you; spend a
                lot of time with them, and it will change your life."{" "}
                <span className="font-light block mt-1 text-xs  md:text-sm lg:text-xl">
                  — Amy Poehler
                </span>
              </blockquote>
            </motion.div>
          </div>
          <div className="self-stretch w-[50%] flex flex-col justify-end items-center pb-[35%] md:pb-[10%]">
            <motion.div
              initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              viewport={{ amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <blockquote className="text-base md:text-xl lg:text-3xl font-bold w-full pl-[18%] md:pr-0  md:w-[70%] lg:w-[60%] mx-auto font-poppins">
                "Great things in business are never done by one person; they're
                done by a team of people."
                <span className="font-light block mt-1 text-xl">
                  {" "}
                  — Steve Jobs
                </span>
              </blockquote>
            </motion.div>
          </div>
        </div>
      </section>
      <div className="relative w-full flex justify-center items-center flex-col  py-3">
        <motion.h2
          initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-2xl md:text-4xl font-extrabold font-poppins"
        >
          IDEAS NEED SPACE
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-xl md:text-3xl font-light font-poppins"
        >
          We give it for free!
        </motion.p>
      </div>
    </div>
  );
};

export default SloganSection;
