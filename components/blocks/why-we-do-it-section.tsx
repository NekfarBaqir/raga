import { motion } from "motion/react";
import Image from "next/image";
import CornerCroppedButton from "../ui/corner-cropped-button";

const WhyWeDotItSection = () => {
  return (
    <section className="relative w-full flex justify-start items-start h-fit overflow-hidden max-w-[1800px] mx-auto px-12 md:px-16 lg:px-20">
      <div className="w-[50%] self-stretch flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative  aspect-[424/618] h-[618px] w-auto"
        >
          <Image
            src={"/images/hero-section-bg.png"}
            alt="hero-section-bg"
            className="object-cover"
            loading="lazy"
            fill
          />
        </motion.div>
      </div>
      <div className="w-[50%] self-stretch relative flex flex-col justify-end items-start gap-10 pb-[4%]">
        <motion.h2
          initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl font-bold font-poppins"
        >
          WHY WE <span className="block">DO?</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-lg"
        >
          Raga was created to empower Afghanistan's brightest minds with the
          tools, space, and community they need to thrive. We believe innovation
          should not be limited by infrastructure. By providing a supportive
          environment, we help ambitious individuals and teams turn bold ideas
          into technologies that solve real problems for Afghan people.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full flex justify-end items-end"
        >
          {" "}
          <CornerCroppedButton link="/about">Discover More</CornerCroppedButton>
        </motion.div>
      </div>

      <span className="absolute top-0 right-0 text-sm font-light px-12 md:px-16 lg:px-20">
        ABOUT US
      </span>
    </section>
  );
};

export default WhyWeDotItSection;
