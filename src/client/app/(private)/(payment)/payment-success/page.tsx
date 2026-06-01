"use client";
import { motion } from "framer-motion";
import { CheckCircle, ShoppingCart, Headphones } from "lucide-react";
import Link from "next/link";

const PaymentSucceeded = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center min-h-screen bg-green-100 p-4"
    >
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-green-600 mb-6"
      >
        <CheckCircle size={80} />
      </motion.div>

      {/* Success Message */}
      <h1 className="text-center text-3xl font-semibold text-green-700 mb-4">
        Your payment was successful!
      </h1>

      <p className="text-center text-lg text-gray-700 mb-6">
        Thank you for your purchase. Your order has been processed.
      </p>

      {/* Helpful Links */}
      <div className="flex space-x-6">
        <Link
          href={"/orders"}
          className="flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <ShoppingCart size={18} />
          <span>View Orders</span>
        </Link>
        <Link
          href={"/support"}
          className="flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <Headphones size={18} />
          <span>Contact Support</span>
        </Link>
      </div>
    </motion.div>
  );
};

export default PaymentSucceeded;
