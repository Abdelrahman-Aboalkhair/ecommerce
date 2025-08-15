"use client";
import React from "react";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { ApolloError } from "@apollo/client";
import ProductCard from "./ProductCard";
import { Product } from "@/app/types/productTypes";

interface ProductSectionProps {
  title: string;
  products: Product[];
  loading: boolean;
  error: ApolloError | undefined;
  showTitle?: boolean;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  products,
  error,
  showTitle = false,
}) => {
  if (error) {
    return (
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package size={32} className="text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-red-700 mb-2">
                Error loading {title.toLowerCase()}
              </h3>
              <p className="text-red-600 text-sm">{error.message}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!products.length) {
    return (
      <section className="py-8 sm:py-12 lg:py-16 ">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No {title.toLowerCase()} available
              </h3>
              <p className="text-gray-600 text-sm">
                Check back soon for new products!
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12 lg:py-16 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {showTitle && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl sm:text-[22px] font-semibold text-gray-900 capitalize">
                {title}
              </h2>
              {products.length > 8 && (
                <button
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3
                 rounded-sm font-semibold
                  self-start sm:self-auto text-sm"
                >
                  View All
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-3 gap-4 sm:gap-4">
          {products.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(ProductSection);
