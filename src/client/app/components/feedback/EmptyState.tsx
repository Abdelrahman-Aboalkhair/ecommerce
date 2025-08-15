"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  actionOnClick?: () => void;
  secondaryActionText?: string;
  secondaryActionHref?: string;
  secondaryActionOnClick?: () => void;
  showIllustration?: boolean;
  variant?: "default" | "compact" | "centered";
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  actionHref,
  actionOnClick,
  secondaryActionText,
  secondaryActionHref,
  secondaryActionOnClick,
  showIllustration = true,
  variant = "default",
}) => {
  const ActionButton = () => {
    if (!actionText) return null;

    const buttonClass =
      "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2";

    if (actionHref) {
      return (
        <Link href={actionHref} className={buttonClass}>
          {actionText}
        </Link>
      );
    }

    if (actionOnClick) {
      return (
        <button onClick={actionOnClick} className={buttonClass}>
          {actionText}
        </button>
      );
    }

    return null;
  };

  const SecondaryButton = () => {
    if (!secondaryActionText) return null;

    const buttonClass =
      "bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md border border-gray-200";

    if (secondaryActionHref) {
      return (
        <Link href={secondaryActionHref} className={buttonClass}>
          {secondaryActionText}
        </Link>
      );
    }

    if (secondaryActionOnClick) {
      return (
        <button onClick={secondaryActionOnClick} className={buttonClass}>
          {secondaryActionText}
        </button>
      );
    }

    return null;
  };

  const containerClass =
    variant === "compact"
      ? "py-8"
      : variant === "centered"
      ? "min-h-[60vh] flex items-center justify-center"
      : "py-12";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`text-center ${containerClass}`}
    >
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            type: "spring",
            stiffness: 200,
          }}
          className="mb-6"
        >
          <div className="relative inline-block">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-indigo-500 rounded-full opacity-20"
            />
            <div className="relative bg-white rounded-full p-4 shadow-lg border border-indigo-100">
              <Icon className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-3"
        >
          {ActionButton() && (
            <div>
              <ActionButton />
            </div>
          )}

          {SecondaryButton() && (
            <div>
              <SecondaryButton />
            </div>
          )}
        </motion.div>

        {/* Optional Illustration */}
        {showIllustration && variant !== "compact" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-indigo-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-700">
                  Need help?
                </span>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Contact our support team for assistance
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default EmptyState;
