"use client";

import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const SpeakerComponentReversed = () => {
  const router = useRouter();
  return (
    <div
      className="flex flex-col-reverse w-full  md:flex-row items-center justify-between max-w-7xl mx-auto min-h-[600px] p-4 md:p-0"
      style={{ color: "var(--color-foreground)" }}
    >
      <motion.div
        className="relative w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] cursor-alias rounded-xl overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ backgroundColor: "var(--card)" }}
      >
        <Image
          src="/images/team.jpg"
          alt="Team"
          fill
          className="object-cover"
        />
      </motion.div>

      <div className="w-full md:w-1/2 space-y-4 md:ml-10 mt-10 md:mt-0">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
          style={{ color: "var(--color-muted-foreground)" }}
          className="text-base"
        >
          🔹 Where big ideas find room to shine.
        </motion.p>

        <motion.h1
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          style={{ color: "var(--color-foreground)" }}
          className="text-4xl font-bold mb-10"
        >
          For Visionary Teams
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          style={{ color: "var(--color-muted-foreground)" }}
          className="text-base"
        >
          Raga welcomes teams with a strong vision and the expertise to make it real. Whether you're refining your own idea or exploring new challenges with us, this is a place to collaborate, innovate, and build for Afghanistan's future.
        </motion.p>

        <motion.div  initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
          className="group"
       >
      <Button onClick={()=>{
        router.push("/apply?team=true")
      }}  className="rounded-full cursor-pointer hover:bg-primary/80   !p-4" size={"lg"}>Apply as Team <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-all duration-300" /></Button>
       </motion.div>
      </div>
    </div>
  );
};

export default SpeakerComponentReversed;
