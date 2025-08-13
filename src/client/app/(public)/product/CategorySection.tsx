"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import ProductCard from "./ProductCard";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../../gql/Product";
import SkeletonLoader from "@/app/components/feedback/SkeletonLoader";

interface CategorySectionProps {
  categoryId: string;
  categoryName: string;
  pageSize: number;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  categoryId,
  categoryName,
  pageSize,
}) => {
  const [skip, setSkip] = useState(0);
  const { data, loading, error, fetchMore } = useQuery(GET_PRODUCTS, {
    variables: { first: pageSize, skip: 0, filters: { categoryId } },
    fetchPolicy: "cache-and-network",
  });

  const products = data?.products?.products || [];
  const hasMore = data?.products?.hasMore || false;

  const handleShowMore = () => {
    fetchMore({
      variables: {
        first: pageSize,
        skip: skip + pageSize,
        filters: { categoryId },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          products: {
            ...fetchMoreResult.products,
            products: [
              ...prev.products.products,
              ...fetchMoreResult.products.products,
            ],
          },
        };
      },
    }).then(() => setSkip(skip + pageSize));
  };

  if (loading && skip === 0) {
    return <SkeletonLoader />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-500">
          Error loading {categoryName}: {error.message}
        </p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-12">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-lg text-gray-600">
          No products found in {categoryName}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full p-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center space-x-3">
          <div className="h-6 w-1 rounded-full bg-primary"></div>
          <h2 className="ml-2 text-xl font-extrabold font-sans tracking-wide text-gray-700 capitalize">
            {categoryName}
          </h2>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={handleShowMore}
            className="bg-primary text-white px-8 py-3 rounded transition-colors duration-300 font-medium"
            disabled={loading}
          >
            {loading ? "Loading..." : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(CategorySection);
