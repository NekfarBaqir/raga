import { motion } from "motion/react"
import GridCarousel from "../ui/carousel/grid-carousel"

const OurPartnersSection = () => {
  return (
    <div className="w-full flex flex-col justify-start items-start gap-2.5 px-4 max-w-[1800px] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-2xl md:text-5xl font-bold font-poppins"
        >
          OUR PARTNERS
        </motion.h2>
      <GridCarousel />
    </div>
  )
}

export default OurPartnersSection
