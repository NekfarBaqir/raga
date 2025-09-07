"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const SpeakerComponent = () => {
  return (
    <div
      className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto min-h-[600px] p-4 md:p-0"
      style={{ color: "var(--color-foreground)" }}
    >
      <div className="w-full md:w-1/2 space-y-4">
        <motion.p
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
          style={{ color: "var(--color-muted-foreground)" }}
          className="text-base"
        >
          ✦ The Perfect Sound, Anywhere
        </motion.p>

        <motion.h1
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          style={{ color: "var(--color-foreground)" }}
          className="text-4xl font-bold mt-10 mb-10"
        >
          Experience crystal-clear audio with deep bass and immersive sound.
        </motion.h1>

        <motion.p
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          style={{ color: "var(--color-muted-foreground)" }}
          className="text-base"
        >
          Our smart speaker is designed to fill your space with rich,
          high-fidelity sound—whether you're at home or on the go.
        </motion.p>

        <motion.button
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
          className="px-6 py-2 rounded-full bg-foreground text-background font-medium transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Buy now
        </motion.button>
      </div>

      <motion.div
        className="w-full md:w-1/2 flex justify-center md:justify-end mt-10 md:mt-0"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="relative w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] cursor-alias rounded-xl overflow-hidden"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
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
