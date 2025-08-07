"use client";

import {
  AlertTriangle,
  RefreshCw,
  Home,
  MessageCircle,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-red-200 rounded-full opacity-20 animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-24 h-24 bg-orange-200 rounded-full opacity-20 animate-bounce"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-1/2 left-10 w-16 h-16 bg-yellow-200 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-red-100 rounded-full opacity-20 animate-bounce"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      {/* Main error content */}
      <div className="relative z-10 max-w-md w-full">
        {/* Error icon with animation */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-25"></div>
            <div className="relative bg-white rounded-full p-4 shadow-lg">
              <AlertTriangle className="w-12 h-12 text-red-500 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Error message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-3 animate-fade-in">
            Oops! Something went wrong
          </h1>
          <p
            className="text-gray-600 text-lg leading-relaxed animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Don&apos;t worry, these things happen. We&apos;re here to help you
            get back on track.
          </p>
        </div>

        {/* Action buttons */}
        <div
          className="space-y-4 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

          <div className="flex gap-3">
            <button
              onClick={handleGoHome}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-md"
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>

            <button
              onClick={handleReport}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              Report Issue
            </button>
          </div>
        </div>

        {/* Additional help section */}
        <div
          className="mt-8 text-center animate-fade-in"
          style={{ animationDelay: "0.6s" }}
        >
          <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-600">
                Quick fixes
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Try refreshing the page, clearing your cache, or check your
              internet connection
            </p>
          </div>
        </div>
      </div>

      {/* CSS for custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default GlobalError;
