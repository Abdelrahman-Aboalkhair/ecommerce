"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CategoryBoxProps {
  title: string;
  items: Array<{
    name: string;
    image: any;
  }>;
  ctaText: string;
  ctaLink: string;
  isMobile?: boolean;
}

const CategoryBox = ({
  title,
  items,
  ctaText,
  ctaLink,
  isMobile = false,
}: CategoryBoxProps) => {
  return (
    <div
      className={`
      bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl 
      transition-all duration-300 transform hover:-translate-y-1 
      border border-white/20 overflow-hidden group
      ${isMobile ? "p-2" : "p-3 sm:p-4 lg:p-5"}
    `}
    >
      {/* Header */}
      <div className="mb-2 sm:mb-3">
        <h3
          className={`
          font-bold text-gray-900 leading-tight
          ${isMobile ? "text-sm" : "text-base sm:text-lg lg:text-xl"}
        `}
        >
          {title}
        </h3>
      </div>

      {/* Product Grid */}
      <div
        className={`
        grid grid-cols-2 gap-1 sm:gap-2 mb-2 sm:mb-3
        ${isMobile ? "gap-1 mb-2" : "gap-2 sm:gap-3 mb-3"}
      `}
      >
        {items.map((item, index) => (
          <div key={index} className="flex flex-col">
            <div
              className={`
              relative w-full aspect-square overflow-hidden rounded-md
              bg-gray-100 group-hover:scale-105 transition-transform duration-300
              ${isMobile ? "rounded-sm" : "rounded-md"}
            `}
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes={
                  isMobile
                    ? "80px"
                    : "(max-width: 768px) 100px, (max-width: 1200px) 120px, 150px"
                }
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
            </div>
            <span
              className={`
              text-gray-600 truncate w-full text-center mt-1 font-medium
              ${isMobile ? "text-xs" : "text-sm sm:text-base"}
            `}
            >
              {item.name}
            </span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <Link
        href={ctaLink}
        className={`
          inline-flex items-center justify-center w-full
          bg-gradient-to-r from-indigo-500 to-purple-600 
          hover:from-indigo-600 hover:to-purple-700
          text-white font-medium rounded-md
          transition-all duration-300 transform hover:scale-[1.02]
          shadow-sm hover:shadow-md group-hover:shadow-lg
          ${
            isMobile
              ? "text-xs py-1.5 px-2"
              : "text-sm sm:text-base py-2 px-3 lg:py-2.5 lg:px-4"
          }
        `}
      >
        <span className="mr-1">{ctaText}</span>
        <ArrowRight
          size={isMobile ? 12 : 14}
          className="group-hover:translate-x-0.5 transition-transform duration-300"
        />
      </Link>
    </div>
  );
};

export default CategoryBox;
