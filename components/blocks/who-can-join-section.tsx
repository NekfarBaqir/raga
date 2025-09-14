import { motion } from "motion/react";
import Image from "next/image";
import CornerCroppedButton from "../ui/corner-cropped-button";

const WhoCanJoinUS = () => {
  return (
    <section className="relative w-full flex flex-col md:flex-row justify-start items-start h-fit overflow-hidden max-w-[1800px] mx-auto px-12 md:px-16 lg:px-20 gap-10">
      <div className="w-full md:w-[50%] self-stretch flex justify-center items-center pt-7 md:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative  aspect-[424/618] h-[300px] md:h-[618px] w-auto"
        >
          <Image
            src={"/images/team.jpg"}
            alt="hero-section-bg"
            className="object-cover"
            loading="lazy"
            fill
          />
        </motion.div>
      </div>
      <div className="w-full md:w-[50%] self-stretch relative flex flex-col justify-end items-start gap-6 md:gap-5 pb-[4%]">
        <motion.h2
          initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-2xl md:text-5xl font-bold font-poppins"
        >
          WHO CAN <span className="block">JOIN US?</span>
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-sm md:text-lg flex flex-col justify-start items-start gap-3"
        >
          We welcome two kinds of changemakers:
          <p>
            <span className="font-bold"> Ambitious Individuals -</span> skilled engineers, designers,
            or builders who want to grow their talent and contribute to
            impactful projects.
          </p>{" "}
          <p>
            <span className="font-bold"> Visionary Teams —</span> groups with a clear idea, proven skills, and the
          drive to create solutions that improve lives in Afghanistan. If you
          have the passion to build, Raga has the space to support you.
          </p>{" "}
         
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

      <span className="absolute top-0 right-0 text-xs md:text-sm font-light px-12 md:px-16 lg:px-20 uppercase">
        A place for visionaries.
      </span>
    </section>
  );
};

export default WhoCanJoinUS;
