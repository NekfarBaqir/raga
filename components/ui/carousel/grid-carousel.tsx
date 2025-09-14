import PartnerCard from "@/components/blocks/partner-card";
import { useIsMobile } from "@/hooks/use-mobile";
import "swiper/css";
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperNavigationItems from "./swirper-navigation-items";



const data = [
  {
    title: "Entop",
    image: "/images/entop.jpg",
    link: "https://www.youtube.com/@entop4670",
  },
  {
    title: "EsteraX",
    image: "/images/reza-ahmadi.png",
    link: "https://esterax.com",
  },
];

export default function GridCarousel() {
  const isMobile = useIsMobile();
  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={isMobile ? 1 : 5}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
      className="w-full relative "
      modules={[Autoplay]}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
    >
        <SwiperNavigationItems />

      {data.map((item, index) => (
        <SwiperSlide key={index} className="p-4 pt-18">
          <PartnerCard {...item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
