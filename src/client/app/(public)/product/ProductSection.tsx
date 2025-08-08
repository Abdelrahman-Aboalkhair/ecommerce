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
      <div className="py-8 sm:py-12">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-red-600 font-medium">
              Error loading {title.toLowerCase()}
            </p>
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="py-8 sm:py-12">
        <div className="text-center">
          <div className="max-w-md mx-auto">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-lg text-gray-600">
              No {title.toLowerCase()} available
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Check back soon for new products!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-6 sm:py-8 lg:py-12">
      {showTitle && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-6 w-1 bg-indigo-600 rounded-full mr-3"></div>
              <h2 className="text-xl sm:text-xl font-medium text-gray-900 capitalize">
                {title}
              </h2>
            </div>
            {products.length > 8 && (
              <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm sm:text-base transition-colors">
                View All →
              </button>
            )}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default React.memo(ProductSection);
