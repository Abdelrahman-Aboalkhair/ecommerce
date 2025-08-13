"use client";
import { useInitiateCheckoutMutation } from "@/app/store/apis/CheckoutApi";
import React, { useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import useToast from "@/app/hooks/ui/useToast";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";

interface CartSummaryProps {
  subtotal: number;
  shippingRate?: number;
  currency?: string;
  totalItems: number;
  cartId: string;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  shippingRate = 0.01,
  currency = "$",
  totalItems,
}) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const stripePromise = loadStripe(
    "pk_test_51R9gs72KGvEXtMtXXTm7UscmmHYsvk9j3ktaM8vxRb3evNJgG1dpD05YWACweIfcPtpCgOIs4HkpGrTCKE1dZD0p00sLC6iIBg"
  );

  const [initiateCheckout, { isLoading }] = useInitiateCheckoutMutation();

  const shippingFee = useMemo(
    () => subtotal * shippingRate,
    [subtotal, shippingRate]
  );
  const total = useMemo(() => subtotal + shippingFee, [subtotal, shippingFee]);

  const handleInitiateCheckout = async () => {
    try {
      const res = await initiateCheckout(undefined).unwrap();
      const stripe = await stripePromise;
      const result = await stripe?.redirectToCheckout({
        sessionId: res.sessionId,
      });

      if (result?.error) {
        showToast(result.error.message, "error");
      }
    } catch {
      showToast("Failed to initiate checkout", "error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-lg p-6 sm:p-8 border border-gray-200"
    >
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
        Order Summary
      </h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-700">
          <span>Total Items</span>
          <span>{totalItems}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Subtotal</span>
          <span className="font-medium text-gray-800">
            {currency}
            {subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Shipping ({(shippingRate * 100).toFixed(0)}%)</span>
          <span className="font-medium text-gray-800">
            {currency}
            {shippingFee.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between pt-3 border-t border-gray-200">
          <span className="font-semibold text-gray-800">Total</span>
          <span className="font-semibold text-gray-800">
            {currency}
            {total.toFixed(2)}
          </span>
        </div>
      </div>

      {isAuthenticated ? (
        <button
          disabled={isLoading || totalItems === 0}
          onClick={handleInitiateCheckout}
          className="mt-4 w-full bg-indigo-600 text-white py-2.5 rounded-md font-medium text-sm hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isLoading ? "Processing..." : "Proceed to Checkout"}
        </button>
      ) : (
        <Link
          href="/sign-in"
          className="mt-4 w-full inline-block text-center bg-gray-300 text-gray-800 py-2.5 rounded-md font-medium text-sm hover:bg-gray-400 transition-colors"
        >
          Sign in to Checkout
        </Link>
      )}
    </motion.div>
  );
};

export default CartSummary;
