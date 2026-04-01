import React, { memo } from "react";
import Image from "next/image";

interface HomeCardProps {
  img: string;
  alt: string;
  title: string;
  description: string;
  handleClick: () => void;
}

const HomeCard = memo(({ img, alt, title, description, handleClick }: HomeCardProps) => {
  return (
    <div
      className="bg-blue-600 px-4 py-4 flex flex-col justify-between max-w-full min-h-[260px] rounded-[14px] cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex glassmorphism size-12 rounded-[14px]">
        <Image src={img} alt={alt} height={36} width={36} />
      </div>
      <div className="flex flex-col">
        <h1 className="text-2xl font-extrabold">{title}</h1>
        <p className="text-lg">{description}</p>
      </div>
    </div>
  );
});

HomeCard.displayName = "HomeCard";
export default HomeCard


