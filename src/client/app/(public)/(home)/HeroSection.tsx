"use client";

import SliderImg1 from "@/app/assets/images/slider1.jpg";
import SliderImg2 from "@/app/assets/images/slider2.jpg";
import SliderImg3 from "@/app/assets/images/slider3.jpg";
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
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.8,
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
                        className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6 border border-white/30"
                      >
                        <Star size={16} className="text-yellow-400" />
                        <span className="text-sm font-medium">
                          {currentSlide.badge}
                        </span>
                      </motion.div>

                      {/* Title */}
                      <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight"
                      >
                        {currentSlide.title}
                      </motion.h1>

                      {/* Subtitle */}
                      <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg sm:text-xl text-white/90 mb-8 max-w-lg"
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
                          className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          <ShoppingBag size={20} />
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
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 hidden sm:flex items-center justify-center"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 hidden sm:flex items-center justify-center"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {sliderData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
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
          className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
          aria-label="Play/Pause slideshow"
        >
          <Play size={20} />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
