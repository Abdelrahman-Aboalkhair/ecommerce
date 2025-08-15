"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useGetAllCategoriesQuery } from "@/app/store/apis/CategoryApi";
import {
  Smartphone,
  Monitor,
  Headphones,
  Watch,
  Camera,
  Gamepad2,
  Laptop,
  Tablet,
  Speaker,
  Keyboard,
  Mouse,
  Printer,
  Router,
  HardDrive,
  MemoryStick,
  Cpu,
  MonitorSmartphone,
  SmartphoneCharging,
  Wifi,
  Bluetooth,
  Package,
} from "lucide-react";

// Category icon mapping for fallback
const categoryIcons: Record<string, React.ElementType> = {
  electronics: Monitor,
  smartphones: Smartphone,
  laptops: Laptop,
  tablets: Tablet,
  accessories: Headphones,
  gaming: Gamepad2,
  cameras: Camera,
  smartwatches: Watch,
  audio: Speaker,
  peripherals: Keyboard,
  networking: Router,
  storage: HardDrive,
  components: Cpu,
  mobile: MonitorSmartphone,
  charging: SmartphoneCharging,
  wireless: Wifi,
  bluetooth: Bluetooth,
  memory: MemoryStick,
  input: Mouse,
  printing: Printer,
  clothing: Package,
  footwear: Package,
  shoes: Package,
  furniture: Package,
  books: Package,
  watches: Watch,
  headphones: Headphones,
  speakers: Speaker,
  keyboards: Keyboard,
  mousepads: Mouse,
};

// Default icon for categories without specific mapping
const DefaultIcon = Package;

const CategoryBar = () => {
  const { data, isLoading, error } = useGetAllCategoriesQuery({});
  const categories = data?.categories || [];

  // Get icon for category (fallback)
  const getCategoryIcon = (categoryName: string) => {
    const normalizedName = categoryName.toLowerCase().replace(/\s+/g, "");

    // Try exact match first
    if (categoryIcons[normalizedName]) {
      return categoryIcons[normalizedName];
    }

    // Try partial matches
    for (const [key, icon] of Object.entries(categoryIcons)) {
      if (normalizedName.includes(key) || key.includes(normalizedName)) {
        return icon;
      }
    }

    return DefaultIcon;
  };

  if (isLoading) {
    return (
      <section className="pt-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-8 overflow-x-auto">
            {[...Array(8)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex-shrink-0"
              >
                <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
                <div className="w-12 h-3 bg-gray-200 rounded mt-2 animate-pulse" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !categories.length) {
    return null;
  }

  return (
    <section className="pt-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-left mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Shop by Category
          </h2>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-7xl mx-auto">
          {categories.map((category, index) => {
            const hasImages = category.images && category.images.length > 0;
            const imageSrc = hasImages ? category.images[0] : null;
            const Icon = getCategoryIcon(category.name);

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -5, scale: 1.05 }}
                className="group"
              >
                <Link
                  href={`/shop?categoryId=${category.id}`}
                  className="block"
                >
                  <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-lg border border-gray-100 hover:border-indigo-200 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-indigo-50 group-hover:to-purple-50 overflow-hidden">
                    {/* Image or Icon */}
                    <div className="relative mb-3">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-24 bg-gray-100 rounded-lg overflow-hidden group-hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                      >
                        {hasImages && imageSrc ? (
                          <>
                            <Image
                              src={imageSrc}
                              alt={category.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                              sizes="(max-width: 768px) 100px, (max-width: 1200px) 150px, 200px"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                          </>
                        ) : (
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                            className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:shadow-lg transition-all duration-300"
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Hover effect */}
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white z-10"
                      />
                    </div>

                    {/* Category name */}
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-800 text-sm group-hover:text-indigo-700 transition-colors duration-300 truncate">
                        {category.name}
                      </h3>

                      {/* Product count (if available) */}
                      {category.products && (
                        <p className="text-xs text-gray-500 mt-1">
                          {category.products.length} products
                        </p>
                      )}
                    </div>

                    {/* Hover indicator */}
                    <motion.div
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                      className="h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mt-3"
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View All Categories Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <span>View All Categories</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryBar;
