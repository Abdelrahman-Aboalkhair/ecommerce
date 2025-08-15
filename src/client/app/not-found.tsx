"use client";

import {
  Search,
  Home,
  ArrowLeft,
  ShoppingBag,
  Package,
  Zap,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const NotFoundPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(
        searchQuery.trim()
      )}`;
    }
  };

  const popularCategories = [
    { name: "Electronics", href: "/shop?categoryId=electronics" },
    { name: "Clothing", href: "/shop?categoryId=clothing" },
    { name: "Footwear", href: "/shop?categoryId=footwear" },
    { name: "Furniture", href: "/shop?categoryId=furniture" },
  ];

  const quickLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shop", href: "/shop", icon: ShoppingBag },
    { name: "Categories", href: "/shop", icon: Package },
    { name: "Contact", href: "/contact", icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-20 left-20 w-32 h-32 bg-indigo-300 rounded-full"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.08, scale: 1 }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5,
          }}
          className="absolute bottom-20 right-20 w-24 h-24 bg-purple-300 rounded-full"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.06, scale: 1 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
          className="absolute top-1/2 left-10 w-16 h-16 bg-blue-300 rounded-full"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1.5,
          }}
          className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-indigo-200 rounded-full"
        />
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-2xl w-full text-center"
      >
        {/* 404 Number with animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            type: "spring",
            stiffness: 200,
          }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-indigo-500 rounded-full opacity-20"
            />
            <div className="relative bg-white rounded-full p-8 shadow-lg border border-indigo-100 inline-block">
              <span className="text-6xl md:text-8xl font-bold text-indigo-600">
                404
              </span>
            </div>
          </div>
        </motion.div>

        {/* Error message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist. Let&apos;s help
            you find what you need.
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl p-4 pl-12 pr-4 text-gray-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Search
              </button>
            </div>
          </form>
        </motion.div>

        {/* Popular categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Popular Categories
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {popularCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              >
                <Link
                  href={category.href}
                  className="bg-white hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md border border-gray-200 hover:border-indigo-200"
                >
                  {category.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.history.back()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>

            <Link
              href="/"
              className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md border border-gray-200"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
          </div>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-indigo-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Quick Navigation
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-indigo-50 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors duration-200">
                      <link.icon className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">
                      {link.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Help section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-6"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-indigo-100">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-medium text-gray-700">
                Need help?
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Contact our support team or check our help center for assistance
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
