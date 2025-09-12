import { ragaFaq } from "@/constants/raga-faq";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

const FAQSection = () => {
  return (
    <section className=" flex-col md:flex-row relative w-full flex justify-start items-start h-fit overflow-hidden max-w-[1800px] mx-auto px-12 md:px-16 lg:px-20 gap-10 py-10  ">
      <div className="w-[40%] self-stretch relative flex flex-col justify-start items-start gap-10 pb-[4%] ">
        <h2 className="text-5xl font-bold font-poppins uppercase">
          Everything You
          <span className="block"> Need to Know</span>
        </h2>
      
   
      </div>

      <div className="w-[60%] flex justify-end items-center">
        <div className="w-[90%] self-stretch flex justify-center items-center">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                {ragaFaq?.map((faq) => (
                    <AccordionItem value={faq.question}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                ))}
              
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <span className="absolute top-0 left-0 text-sm font-light px-12 md:px-16 lg:px-20 uppercase">
        Welcome to Beyond FAQ!
      </span>
    </section>
  );
};

export default FAQSection;
