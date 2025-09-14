import AboutRagaSection from "@/components/blocks/about-raga-section"

const page = () => {
  return (
    <div className="flex flex-col items-start justify-start h-fit py-10 max-w-7xl mx-auto">

<h2 className="text-2xl w-full text-center md:text-left  lg:text-3xl xl:text-4xl font-bold py-12 pb-0">Our History and Vision</h2>

    <AboutRagaSection showTheSVG={false}/>
   
  </div>
  )
}

export default page
