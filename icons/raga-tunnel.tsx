

"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const RagaTunnelLeft = ({ className }: { className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"] // Start drawing when element is 80% down the viewport, finish when 20% up
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const fillOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className={className}>
      <svg width="163" height="369" viewBox="0 0 163 369" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path 
          d="M31.0656 0.333252H0L138.847 151.934L136.463 368.285H162.109V143.319H162.016L31.0656 0.333252Z" 
          fill="url(#paint0_linear_1_442)"
          stroke="url(#paint0_linear_1_442)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            pathLength: pathLength,
            opacity: opacity,
            fillOpacity: fillOpacity
          }}
        />
        <defs>
          <linearGradient id="paint0_linear_1_442" x1="49.4428" y1="0.333252" x2="49.4428" y2="368.285" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B71C1C" stopOpacity="0"/>
            <stop offset="1" stopColor="#B71C1C"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};


const RagaTunnelRight = ({ className }: { className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"] // Start drawing when element is 80% down the viewport, finish when 20% up
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const fillOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className={className}>
      <svg width="161" height="368" viewBox="0 0 161 368" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path 
          d="M160.5 0H131.494L0.607448 142.916C0.567096 142.96 0.510095 142.986 0.450348 142.986V142.986V367.952H23.7387V153.561L160.5 0Z" 
          fill="url(#paint0_linear_1_440)"
          stroke="url(#paint0_linear_1_440)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            pathLength: pathLength,
            opacity: opacity,
            fillOpacity: fillOpacity
          }}
        />
        <defs>
          <linearGradient id="paint0_linear_1_440" x1="113.117" y1="0" x2="113.117" y2="367.952" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B71C1C" stopOpacity="0"/>
            <stop offset="1" stopColor="#B71C1C"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};


export { RagaTunnelLeft, RagaTunnelRight };



