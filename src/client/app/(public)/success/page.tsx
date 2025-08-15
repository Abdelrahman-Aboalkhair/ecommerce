"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Home, ShoppingBag, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "order";
  const orderId = searchParams.get("orderId");
  const email = searchParams.get("email");

  const successConfigs = {
    order: {
      icon: CheckCircle,
      title: "Order Confirmed!",
      description:
        "Thank you for your purchase. Your order has been successfully placed and is being processed.",
      details: orderId ? `Order #${orderId}` : undefined,
      primaryAction: { text: "View Order", href: "/orders", icon: ShoppingBag },
      secondaryAction: {
        text: "Continue Shopping",
        href: "/shop",
        icon: ArrowRight,
      },
      nextSteps: [
        "You'll receive an email confirmation shortly",
        "We'll notify you when your order ships",
        "Track your order in your account dashboard",
      ],
    },
    password: {
      icon: CheckCircle,
      title: "Password Reset Successful!",
      description:
        "Your password has been successfully reset. You can now log in with your new password.",
      primaryAction: { text: "Sign In", href: "/sign-in", icon: ArrowRight },
      secondaryAction: { text: "Go Home", href: "/", icon: Home },
      nextSteps: [
        "Use your new password to sign in",
        "Keep your password secure",
        "Enable two-factor authentication for extra security",
      ],
    },
    email: {
      icon: CheckCircle,
      title: "Email Verified!",
      description:
        "Your email address has been successfully verified. Your account is now fully activated.",
      primaryAction: {
        text: "Go to Dashboard",
        href: "/dashboard",
        icon: ArrowRight,
      },
      secondaryAction: {
        text: "Start Shopping",
        href: "/shop",
        icon: ShoppingBag,
      },
      nextSteps: [
        "Your account is now fully activated",
        "You can access all features",
        "Complete your profile for a better experience",
      ],
    },
    profile: {
      icon: CheckCircle,
      title: "Profile Updated!",
      description:
        "Your profile has been successfully updated. Your changes are now saved.",
      primaryAction: {
        text: "View Profile",
        href: "/profile",
        icon: ArrowRight,
      },
      secondaryAction: { text: "Go Home", href: "/", icon: Home },
      nextSteps: [
        "Your profile changes are now active",
        "You can update your preferences anytime",
        "Check your account settings for more options",
      ],
    },
  };

  const config =
    successConfigs[type as keyof typeof successConfigs] || successConfigs.order;
  const Icon = config.icon;

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
        {/* Success icon with animation */}
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
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-green-500 rounded-full opacity-20"
            />
            <div className="relative bg-white rounded-full p-6 shadow-lg border border-green-100 inline-block">
              <Icon className="w-12 h-12 text-green-600" />
            </div>
          </div>
        </motion.div>

        {/* Success message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {config.title}
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto mb-4">
            {config.description}
          </p>
          {config.details && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-green-100 inline-block">
              <span className="text-sm font-medium text-gray-700">
                {config.details}
              </span>
            </div>
          )}
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={config.primaryAction.href}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <config.primaryAction.icon className="w-5 h-5" />
              {config.primaryAction.text}
            </Link>

            <Link
              href={config.secondaryAction.href}
              className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md border border-gray-200"
            >
              <config.secondaryAction.icon className="w-5 h-5" />
              {config.secondaryAction.text}
            </Link>
          </div>
        </motion.div>

        {/* Next steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-green-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              What happens next?
            </h3>
            <div className="space-y-3">
              {config.nextSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600 leading-relaxed">
                    {step}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-green-100">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700">
                Check your email
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              {email
                ? `We've sent a confirmation to ${email}`
                : "We've sent you a confirmation email with all the details"}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
