"use client";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

const Player = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;
      setConfig({ width, height });
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      viewport={{ amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative  aspect-[621/418] w-full border"
      ref={containerRef}
    >
      <ReactPlayer
        src="https://youtu.be/NsAcT_XYsJU?si=bLtwVc6Xdh9XCQmM"
        controls
        className="w-full object-cover "
        width={config?.width}
        height={config?.height}
      />
    </motion.div>
  );
};

export default Player;
