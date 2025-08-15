"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { generateProductPlaceholder } from "@/app/utils/placeholderImage";

interface ProductImageGalleryProps {
  images: string[];
  name: string;
  defaultImage: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  name,
  defaultImage,
}) => {
  const [selectedImage, setSelectedImage] = useState(
    defaultImage || images[0] || generateProductPlaceholder(name)
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const galleryRef = useRef<HTMLDivElement>(null);

  // Update selectedIndex when selectedImage changes
  useEffect(() => {
    const index = images.findIndex((img) => img === selectedImage);
    if (index !== -1) {
      setSelectedIndex(index);
    } else {
      setSelectedIndex(0);
    }
  }, [selectedImage, images]);

  // Handle full-screen change events
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  const handleImageSelect = (img: string, index: number) => {
    setSelectedImage(img);
    setSelectedIndex(index);
    setIsZoomed(false);
  };

  const handlePrevImage = () => {
    const newIndex =
      selectedIndex === 0 ? images.length - 1 : selectedIndex - 1;
    setSelectedImage(images[newIndex] || defaultImage);
    setSelectedIndex(newIndex);
    setIsZoomed(false);
  };

  const handleNextImage = () => {
    const newIndex =
      selectedIndex === images.length - 1 ? 0 : selectedIndex + 1;
    setSelectedImage(images[newIndex] || defaultImage);
    setSelectedIndex(newIndex);
    setIsZoomed(false);
  };

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  const handleFullScreenToggle = async () => {
    if (!galleryRef.current) return;

    if (!isFullScreen) {
      try {
        await galleryRef.current.requestFullscreen();
        setIsFullScreen(true);
      } catch (err) {
        console.error("Failed to enter fullscreen:", err);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullScreen(false);
      } catch (err) {
        console.error("Failed to exit fullscreen:", err);
      }
    }
    setIsZoomed(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;

    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setMousePosition({ x, y });
  };

  if (images.length === 0) {
    return (
      <div className="relative bg-gray-50 rounded-2xl p-6 flex items-center justify-center h-[500px]">
        <Image
          src={generateProductPlaceholder(name)}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain rounded-xl"
          priority
        />
      </div>
    );
  }

  return (
    <div
      ref={galleryRef}
      className={`relative ${
        isFullScreen ? "bg-black h-screen w-screen p-4" : ""
      }`}
    >
      <button
        onClick={handleFullScreenToggle}
        className="absolute top-4 right-4 z-10 rounded-full p-2 bg-white bg-opacity-80 shadow-md hover:bg-gray-100"
        aria-label={isFullScreen ? "Exit fullscreen" : "View fullscreen"}
      >
        {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
      </button>

      <div
        className={`flex ${
          isFullScreen ? "h-full" : ""
        } flex-col md:flex-row gap-6`}
      >
        {/* Thumbnails */}
        <div
          className={`flex md:flex-col gap-3 ${
            isFullScreen
              ? "md:max-h-screen overflow-y-auto"
              : "md:max-h-[540px] overflow-x-auto md:overflow-y-auto"
          }`}
        >
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => handleImageSelect(img, index)}
              className={`relative border-2 rounded-xl p-1 transition-all duration-200 ${
                selectedImage === img
                  ? "border-indigo-600 shadow-md"
                  : "border-gray-200 hover:border-indigo-400"
              }`}
            >
              <div className="relative w-20 h-20">
                <Image
                  src={img}
                  alt={`${name} thumbnail ${index + 1}`}
                  fill
                  sizes="80px"
                  className="rounded-lg object-cover"
                  priority={index < 2}
                  onError={(e) => {
                    e.currentTarget.src = generateProductPlaceholder(name);
                  }}
                />
              </div>
            </button>
          ))}
        </div>

        {/* Main Image Container */}
        <div
          className={`relative flex-1 ${
            isFullScreen ? "flex items-center justify-center" : ""
          }`}
        >
          {/* Navigation Arrows */}
          <div className="absolute inset-y-0 left-2 flex items-center z-10">
            <button
              onClick={handlePrevImage}
              className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all transform hover:scale-105"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          <div className="absolute inset-y-0 right-2 flex items-center z-10">
            <button
              onClick={handleNextImage}
              className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all transform hover:scale-105"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Zoom Control */}
          <div className="absolute top-4 right-16 flex gap-2 z-10">
            <button
              onClick={handleZoomToggle}
              className={`bg-white bg-opacity-80 rounded-full p-2 shadow-md transition-all ${
                isZoomed ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-100"
              }`}
              aria-label={isZoomed ? "Exit zoom" : "Zoom image"}
            >
              <ZoomIn size={20} />
            </button>
          </div>

          {/* Main Image */}
          <div
            className={`flex items-center justify-center ${
              isFullScreen ? "h-full" : "bg-gray-50 rounded-2xl p-6"
            } overflow-hidden`}
            onMouseMove={handleMouseMove}
            style={{ cursor: isZoomed ? "zoom-out" : "zoom-in" }}
            onClick={handleZoomToggle}
          >
            <div
              className={`relative ${
                isFullScreen ? "max-h-full max-w-full" : "h-[500px] w-full"
              } overflow-hidden rounded-xl`}
            >
              <Image
                src={selectedImage}
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={`object-contain transition-all duration-300 ${
                  isZoomed ? "scale-150" : "scale-100"
                }`}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                        objectPosition: "center",
                      }
                    : {}
                }
                priority
                onError={(e) => {
                  e.currentTarget.src = generateProductPlaceholder(name);
                }}
              />
            </div>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-6 left-6 bg-white bg-opacity-80 px-3 py-1 rounded-full text-sm text-gray-700 shadow-sm">
            {selectedIndex + 1} / {images.length || 1}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;
