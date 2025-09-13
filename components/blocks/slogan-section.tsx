"use client";

import ExtendedLogoLarge from "@/icons/extended-logo-large";
import { motion } from "motion/react";

const SloganSection = () => {
  return (
    <div className="w-full h-fit overflow-visible -mt-[65vh] ">
      <section className="h-full w-[94%] min-h-[963px] relative mx-auto  flex">
        <ExtendedLogoLarge className="object-contain w-full h-fit absolute" />
        <div className="relative self-stretch w-[94%]   flex justify-start items-start max-w-[1320px] mx-auto">
          <div className="self-stretch w-[50%] flex flex-col justify-center items-center">
            <motion.div
              initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              viewport={{ amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <blockquote className="text-3xl font-bold w-[60%] mx-auto font-poppins">
                "Find a group of people who challenge and inspire you; spend a
                lot of time with them, and it will change your life."{" "}
                <span className="font-light block mt-1 text-xl">
                  — Amy Poehler
                </span>
              </blockquote>
            </motion.div>
          </div>
          <div className="self-stretch w-[50%] flex flex-col justify-end items-center pb-[10%]">
            <motion.div
              initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              viewport={{ amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <blockquote className="text-3xl font-bold w-[60%] mx-auto font-poppins">
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
      <div className="relative w-full flex justify-center items-center flex-col">
        <motion.h2
          initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl font-bold font-poppins"
        >
          IDEAS NEED SPACE
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl font-light font-poppins"
        >
          We give it for free!
        </motion.p>
      </div>
    </div>
  );
};

export default SloganSection;
