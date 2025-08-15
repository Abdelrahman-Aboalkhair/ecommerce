"use client";

import {
  AlertTriangle,
  RefreshCw,
  Home,
  MessageCircle,
  Zap,
  ArrowLeft,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface GlobalErrorProps {
  error?: Error;
  reset: () => void;
}

const GlobalError: React.FC<GlobalErrorProps> = ({ error, reset }) => {
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (error) {
      console.error("Global Error:", error);
    }
  }, [error]);

  const handleRetry = async () => {
    setIsRetrying(true);
    // Simulate retry delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRetrying(false);
    reset();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleReport = () => {
    // In a real app, this would open a support form or email
    alert("Report functionality would open here");
  };

  const handleGoBack = () => {
    window.history.back();
  };

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

      {/* Main error content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-md w-full"
      >
        {/* Error icon with animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            type: "spring",
            stiffness: 200,
          }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-indigo-500 rounded-full opacity-20"
            />
            <div className="relative bg-white rounded-full p-4 shadow-lg border border-indigo-100">
              <AlertTriangle className="w-12 h-12 text-indigo-600" />
            </div>
          </div>
        </motion.div>

        {/* Error message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Don&apos;t worry, these things happen. We&apos;re here to help you
            get back on track.
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4"
        >
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Try Again
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleGoBack}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>

            <button
              onClick={handleGoHome}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-md"
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>
          </div>

          <button
            onClick={handleReport}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-md border border-gray-200"
          >
            <MessageCircle className="w-4 h-4" />
            Report Issue
          </button>
        </motion.div>

        {/* Additional help section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-indigo-100">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-medium text-gray-700">
                Quick fixes
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed text-center">
              Try refreshing the page, clearing your cache, or check your
              internet connection
            </p>
          </div>
        </motion.div>

        {/* Error details (for development) */}
        {process.env.NODE_ENV === "development" && error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6"
          >
            <details className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-indigo-100">
              <summary className="text-sm font-medium text-gray-700 cursor-pointer hover:text-indigo-600 transition-colors">
                Error Details (Development)
              </summary>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 font-mono break-all">
                  {error.message}
                </p>
                {error.stack && (
                  <pre className="text-xs text-gray-500 mt-2 whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                )}
              </div>
            </details>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default GlobalError;
