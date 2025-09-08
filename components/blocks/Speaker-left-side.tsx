"use client";

import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const SpeakerComponent = () => {
  const router = useRouter();
  return (
    <div
      className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto min-h-[600px] p-4 md:p-0"
      style={{ color: "var(--color-foreground)" }}
    >
      <div className="w-full md:w-1/2 space-y-4">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
          style={{ color: "var(--color-muted-foreground)" }}
          className="text-base "
        >
          🔹 Bring your skills, vision, and drive.
        </motion.p>

        <motion.h1
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          style={{ color: "var(--color-foreground)" }}
          className="text-4xl font-bold  mb-10"
        >
          For Ambitious Individuals
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          style={{ color: "var(--color-muted-foreground)" }}
          className="text-base"
        >
          If you're a software engineer, designer, DevOps, or a creative mind with entrepreneurial spirit, Raga is your space to grow. Apply as an individual and join a community where bold ideas turn into real impact.
        </motion.p>

       <motion.div  initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
          className="group"
       >
      <Button onClick={()=>{
       router.push("/apply?team=false")
      }} className="rounded-full cursor-pointer hover:bg-primary/80   !p-4" size={"lg"}>Apply as Individual <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-all duration-300" /></Button>
       </motion.div>
      </div>

      <motion.div
        className="w-full md:w-1/2 flex justify-center md:justify-end mt-10 md:mt-0"
        initial={{ opacity: 0}}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="relative w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] cursor-alias rounded-xl overflow-hidden"
          style={{ backgroundColor: "var(--card)" }}
        >
          <Image
            src="/images/entop.jpg"
            alt="Smart Speaker"
            fill
            className="object-cover"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SpeakerComponent;
