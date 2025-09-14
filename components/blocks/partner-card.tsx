import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const PartnerCard = ({
  image,
  title,
  link,
}: {
  image: string;
  title: string;
  link: string;
}) => {
  return (
    <div className="aspect-square w-full h-auto flex flex-col justify-center items-center gap-1.5 min-w-[230px]">
      <Image
        src={image}
        alt="partner-card"
        className="relative w-full h-auto overflow-hidden min-w-[230] aspect-square"
        width={230}
        height={230}
      />

      <Link href={link} className="flex relative justify-center items-center gap-1 group text-foreground hover:text-primary w-full py-1.5">
        {title}
        <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-all duration-300" />
      </Link>
    </div>
  );
};

export default PartnerCard;
