"use client";
import LeftsideSpeaker from "@/components/blocks/Speaker-left-side";
import RightsideSpeaker from "@/components/blocks/Speaker-right-side";

const WhoCanJoinSection = () => {
  return (
   <section className="py-12 flex flex-col justify-start items-start gap-4 px-10 w-full mx-auto">
    <h2 className="text-4xl font-bold w-full text-center">Who can join us? </h2>
    <p className="text-lg w-full text-center">
        Raga is open to all Afghan entrepreneurs, engineers, designers, and creatives who are passionate about building the future of Afghanistan.
    </p>
<div className="w-full flex flex-col justify-center items-center mx-auto">
<LeftsideSpeaker />
<RightsideSpeaker />
</div>

   </section>
  )
}

export default WhoCanJoinSection
