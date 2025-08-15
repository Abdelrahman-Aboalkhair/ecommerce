"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wrench, Clock, RefreshCw, Mail, Wifi, WifiOff } from "lucide-react";

const MaintenancePage = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryCount((prev) => prev + 1);

    // Simulate retry delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Try to reload the page
    window.location.reload();
  };

  const estimatedTime = "2-3 hours";
  const maintenanceStart = "10:00 AM";
  const maintenanceEnd = "1:00 PM";

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
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-2xl w-full text-center"
      >
        {/* Status icon */}
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
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-orange-500 rounded-full opacity-20"
            />
            <div className="relative bg-white rounded-full p-6 shadow-lg border border-orange-100 inline-block">
              {isOnline ? (
                <Wrench className="w-12 h-12 text-orange-600" />
              ) : (
                <WifiOff className="w-12 h-12 text-red-600" />
              )}
            </div>
          </div>
        </motion.div>

        {/* Status message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {isOnline ? "We're Under Maintenance" : "Connection Lost"}
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
            {isOnline
              ? "We're currently performing scheduled maintenance to improve your experience. Please check back soon."
              : "It looks like you've lost your internet connection. Please check your network and try again."}
          </p>
        </motion.div>

        {/* Maintenance details */}
        {isOnline && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-orange-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800 mb-1">Duration</h3>
                  <p className="text-sm text-gray-600">{estimatedTime}</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-orange-600 font-bold text-sm">S</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Start Time
                  </h3>
                  <p className="text-sm text-gray-600">{maintenanceStart}</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-green-600 font-bold text-sm">E</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">End Time</h3>
                  <p className="text-sm text-gray-600">{maintenanceEnd}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Connection status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8"
        >
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              isOnline
                ? "bg-orange-100 text-orange-700 border border-orange-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4" />
                Maintenance Mode
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4" />
                Offline
              </>
            )}
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-4"
        >
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                {isOnline ? "Check Status" : "Retry Connection"}
              </>
            )}
          </button>

          {retryCount > 0 && (
            <p className="text-sm text-gray-500">
              Attempt {retryCount} - We're working to restore service
            </p>
          )}
        </motion.div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-orange-100">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">
                Need immediate assistance?
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Contact our support team at support@ss-commerce.com for urgent
              matters
            </p>
          </div>
        </motion.div>

        {/* Progress indicator */}
        {isOnline && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-6"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-orange-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Maintenance Progress
                </span>
                <span className="text-sm text-orange-600 font-semibold">
                  45%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "45%" }}
                  transition={{ duration: 2, delay: 1 }}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MaintenancePage;
