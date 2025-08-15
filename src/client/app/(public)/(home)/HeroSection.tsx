"use client";

import SliderImg1 from "@/app/assets/images/laptop-slider.jpg";
import SliderImg2 from "@/app/assets/images/furniture-slider.jpeg";
import SliderImg3 from "@/app/assets/images/shirt-slider.jpg";
import SliderImg4 from "@/app/assets/images/shoes-slider.jpeg";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  ShoppingBag,
  Star,
} from "lucide-react";
import Link from "next/link";

interface HeroSectionProps {
  isPreview?: boolean;
}

const HeroSection = ({ isPreview = false }: HeroSectionProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const sliderData = [
    {
      image: SliderImg1,
      title: "Discover Amazing Deals",
      subtitle: "Up to 70% off on selected items",
      ctaText: "Shop Now",
      ctaLink: "/shop",
      badge: "New Arrivals",
    },
    {
      image: SliderImg2,
      title: "Premium Quality Products",
      subtitle: "Handpicked items for your lifestyle",
      ctaText: "Explore",
      ctaLink: "/shop",
      badge: "Featured",
    },
    {
      image: SliderImg3,
      title: "Fast & Free Shipping",
      subtitle: "On orders over $50",
      ctaText: "Learn More",
      ctaLink: "/shop",
      badge: "Limited Time",
    },
    {
      image: SliderImg4,
      title: "Fast & Free Shipping",
      subtitle: "On orders over $50",
      ctaText: "Learn More",
      ctaLink: "/shop",
      badge: "Limited Time",
    },
  ];

  useEffect(() => {
    if (!isPreview) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) =>
          prev === sliderData.length - 1 ? 0 : prev + 1
        );
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isPreview, sliderData.length]);

  const nextSlide = () => {
    setCurrentImageIndex((prev) =>
      prev === sliderData.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? sliderData.length - 1 : prev - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentImageIndex(index);
  };

  const currentSlide = sliderData[currentImageIndex];

  return (
    <section
      className={`relative w-full ${
        isPreview ? "scale-90 my-2" : "my-2 sm:my-4 lg:my-6"
      }`}
    >
      <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl">
        {/* Hero Image Slider */}
        <div className="relative w-full">
          <div className="aspect-[16/9] sm:aspect-[16/7] lg:aspect-[16/6] w-full relative">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 1.1, x: 100, y: 100, rotate: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  x: -100,
                  y: -100,
                  rotate: -10,
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                      {/* Badge */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 border border-white/30"
                      >
                        <Star size={16} className="text-yellow-400" />
                        <span className="text-xs sm:text-sm font-medium">
                          {currentSlide.badge}
                        </span>
                      </motion.div>

                      {/* Title */}
                      <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl sm:text-3xl lg:text-4xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight"
                      >
                        {currentSlide.title}
                      </motion.h1>

                      {/* Subtitle */}
                      <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-lg"
                      >
                        {currentSlide.subtitle}
                      </motion.p>

                      {/* CTA Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Link
                          href={currentSlide.ctaLink}
                          className="inline-flex items-center gap-2 sm:gap-3 bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
                        >
                          <ShoppingBag size={16} className="sm:w-5 sm:h-5" />
                          {currentSlide.ctaText}
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 hidden sm:flex items-center justify-center"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 hidden sm:flex items-center justify-center"
          aria-label="Next slide"
        >
          <ChevronRight size={20} className="sm:w-6 sm:h-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
          {sliderData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Play/Pause Button */}
        <button
          className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-1.5 sm:p-2 rounded-full transition-all duration-300 hover:scale-110"
          aria-label="Play/Pause slideshow"
        >
          <Play size={16} className="sm:w-5 sm:h-5" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
