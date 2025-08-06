"use client";

import SliderImg1 from "@/app/assets/images/slider1.jpg";
import SliderImg2 from "@/app/assets/images/slider2.jpg";
import SliderImg3 from "@/app/assets/images/slider3.jpg";
import Headphones1 from "@/app/assets/images/products/headphones.jpg";
import Headphones2 from "@/app/assets/images/products/headphone2.jpg";
import Keyboard from "@/app/assets/images/products/one-handed-keyboard.jpg";
import BlueShirt from "@/app/assets/images/products/blue-shirt.jpg";
import BlackSmartWatch from "@/app/assets/images/products/black-smart-watch.jpg";
import AirPods from "@/app/assets/images/products/airpods.jpg";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import CategoryBox from "./CategoryBox";

interface HeroSectionProps {
  isPreview?: boolean;
}

const HeroSection = ({ isPreview = false }: HeroSectionProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const sliderImages = [SliderImg1, SliderImg2, SliderImg3];

  useEffect(() => {
    if (!isPreview) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) =>
          prev === sliderImages.length - 1 ? 0 : prev + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPreview, sliderImages.length]);

  const imageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 0,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const categories = [
    {
      title: "Get your game on",
      items: [
        { name: "Gaming Headphones", image: Headphones1 },
        { name: "Keyboard", image: Keyboard },
      ],
      ctaText: "Shop gaming",
      ctaLink: "/category/gaming",
    },
    {
      title: "Shop deals in Fashion",
      items: [
        { name: "Blue Shirt", image: BlueShirt },
        { name: "Smart Watch", image: BlackSmartWatch },
      ],
      ctaText: "See all deals",
      ctaLink: "/deals/fashion",
    },
    {
      title: "Gaming accessories",
      items: [
        { name: "Pro Headsets", image: Headphones2 },
        { name: "Wireless Earbuds", image: AirPods },
      ],
      ctaText: "See more",
      ctaLink: "/category/accessories",
    },
    {
      title: "Shop for your home essentials",
      items: [
        { name: "Kitchen", image: SliderImg1 },
        { name: "Decor", image: SliderImg2 },
      ],
      ctaText: "Discover more in Home",
      ctaLink: "/category/home",
    },
  ];

  return (
    <section
      className={`relative w-full hidden sm:block ${
        isPreview ? "scale-90 my-2" : "my-2 sm:my-4 lg:my-6"
      }`}
    >
      <div className="relative w-full">
        {/* Hero Image Slider */}
        <div className="w-full overflow-hidden rounded-lg shadow-lg">
          <div className="aspect-[16/9] sm:aspect-[16/7] lg:aspect-[16/5] w-full relative">
            <AnimatePresence initial={false} custom={1}>
              <motion.div
                key={currentImageIndex}
                custom={1}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.5 },
                }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={sliderImages[currentImageIndex]}
                  alt={`Slide image ${currentImageIndex + 1}`}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Category Boxes Overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 lg:p-6">
          <div className="w-full max-w-7xl">
            {/* Tablet: 2x2 grid */}
            <div className="hidden sm:grid lg:hidden grid-cols-2 gap-3">
              {categories.map((category, index) => (
                <CategoryBox
                  key={index}
                  title={category.title}
                  items={category.items}
                  ctaText={category.ctaText}
                  ctaLink={category.ctaLink}
                />
              ))}
            </div>

            {/* Desktop: 4 columns */}
            <div className="hidden lg:grid grid-cols-4 gap-4">
              {categories.map((category, index) => (
                <CategoryBox
                  key={index}
                  title={category.title}
                  items={category.items}
                  ctaText={category.ctaText}
                  ctaLink={category.ctaLink}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
