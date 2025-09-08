"use client";
import LeftsideSpeaker from "@/components/blocks/Speaker-left-side";
import RightsideSpeaker from "@/components/blocks/Speaker-right-side";

const WhoCanJoinSection = () => {
  return (
   <section className="py-12 flex flex-col justify-start items-start gap-4 px-10 w-full max-w-[1800px] mx-auto">
    <h2 className="text-4xl font-bold w-full text-center">Who can join us?</h2>
    <p className="text-lg w-full text-center">
        Whether you're an individual with ambitious goals or part of a visionary team, Raga is your gateway to building Afghanistan's future.
    </p>
<div className="w-[95%] md:w-[80%]  flex flex-col gap-10 justify-center items-center mx-auto">
<LeftsideSpeaker />
<RightsideSpeaker />
</div>

   </section>
  )
}

export default WhoCanJoinSection
