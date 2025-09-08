"use client";
import { motion } from "motion/react";
import { CardSpotlight } from "../ui/card-spotlight";
import SubTitle from "../ui/sub-title";

const WhyRagaSection = () => {
  return (
    <section className="w-[80%] max-w-[1800px] mx-auto p-5 flex-col  flex justify-start items-start gap-5 py-20">
      <motion.div
        initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(10px)" }}
        viewport={{  amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <SubTitle>Why Raga</SubTitle>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(10px)" }}
        viewport={{  amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <h2 className=" font-bold text-3xl">
          <span>Where Innovation Meets</span> <span>Opportunity</span>{" "}
        </h2>

        <p className="font-light ">
          We provide the space in two shifts, the morning for <span className="underline">women starting at
          6:00 AM until 1:00 PM</span> and the afternoon for <span className="underline">men starting at 1:00 PM
          until 11:00 PM</span>.
        </p>
      </motion.div>
      <div className="w-full flex-col md:flex-row flex justify-center items-center gap-0">
          <motion.div
            initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            viewport={{  amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            <CardSpotlight className="h-96 w-96" color="#B71C1C">
              <p className="text-xl font-bold relative z-20 mt-2 text-foreground">
                Entrepreneurial Space
              </p>
              <div className="text-foreground mt-4 relative z-20">
                Connect with industry legends:
                <ul className="list-none  mt-2">
                  <li>• Network with successful founders</li>
                  <li>• Learn from mentors</li>
                  <li>• Collaborate with innovators</li>
                </ul>
              </div>
              <p className="text-foreground mt-4 relative z-20 text-sm">
                Thrive alongside greatness where projects succeed.
              </p>
            </CardSpotlight>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            viewport={{  amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          >
            <CardSpotlight className="h-96 w-96" color="#B71C1C">
              <p className="text-xl font-bold relative z-20 mt-2 text-foreground">
                Premium Facilities
              </p>
              <div className="text-foreground mt-4 relative z-20">
                World-class amenities:
                <ul className="list-none  mt-2">
                  <li>• 24/7 electricity</li>
                  <li>• High-speed internet</li>
                  <li>• Free tea & coffee</li>
                  <li>• Modern workstations</li>
                </ul>
              </div>
              <p className="text-foreground mt-4 relative z-20 text-sm">
                Focus on your business, we handle the rest.
              </p>
            </CardSpotlight>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            viewport={{  amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
          >
            <CardSpotlight className="h-96 w-96" color="#B71C1C">
              <p className="text-xl font-bold relative z-20 mt-2 text-foreground">
                Marketing & Growth
              </p>
              <div className="text-foreground mt-4 relative z-20">
                Accelerate your growth:
                <ul className="list-none  mt-2">
                  <li>• Marketing guidance</li>
                  <li>• Brand development</li>
                  <li>• Digital expertise</li>
                  <li>• Growth strategies</li>
                </ul>
              </div>
              <p className="text-foreground mt-4 relative z-20 text-sm">
                From idea to market domination.
              </p>
            </CardSpotlight>
          </motion.div>
        </div>
    </section>
  );
};

export default WhyRagaSection;
