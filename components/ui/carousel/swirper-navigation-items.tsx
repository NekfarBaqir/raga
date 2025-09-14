import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useSwiper } from "swiper/react";

const SwiperNavigationItems = () => {
  const swiper = useSwiper();

  const handleNavigation = (direction: "prev" | "next") => {
    if (direction === "prev") {
      swiper.slidePrev();
    } else {
      swiper.slideNext();
    }
  };

  return (
    <div className="w-full h-fit flex justify-end items-center gap-1.5 absolute top-0 right-0 px-3 py-2 z-40 *:transition-all *:duration-300">
      <button
        onClick={() => handleNavigation("prev")}
        className="bg-accent p-3 hover:bg-primary hover:text-white cursor-pointer"
      >
        <ChevronLeftIcon className="w-4 h-4 lg:w-5 lg:h-5" />
      </button>
      <button
        onClick={() => handleNavigation("next")}
        className="bg-accent p-3 hover:bg-primary hover:text-white cursor-pointer"
      >
        {" "}
        <ChevronRightIcon className="w-4 h-4 lg:w-5 lg:h-5" />
      </button>
    </div>
  );
};

export default SwiperNavigationItems;
