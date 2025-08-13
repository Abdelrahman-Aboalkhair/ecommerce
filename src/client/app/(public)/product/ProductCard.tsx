"use client";
import React, { useEffect } from "react";
import { Eye } from "lucide-react";
import { Product } from "@/app/types/productTypes";
import Image from "next/image";
import Link from "next/link";
import Rating from "@/app/components/feedback/Rating";
import useTrackInteraction from "@/app/hooks/miscellaneous/useTrackInteraction";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { trackInteraction } = useTrackInteraction();
  const router = useRouter();

  useEffect(() => {
    trackInteraction(product.id, "view");
  }, [product.id, trackInteraction]);

  const handleClick = () => {
    trackInteraction(product.id, "click");
    router.push(`/product/${product.slug}`);
  };

  // Compute lowest price among in-stock variants
  const inStockVariants = product.variants.filter(
    (variant) => variant.stock > 0
  );
  const lowestPrice =
    inStockVariants.length > 0
      ? Math.min(...inStockVariants.map((variant) => variant.price))
      : 0;

  return (
    <div
      className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden
       relative h-full flex flex-col hover:shadow-lg hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1"
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative w-full h-48 sm:h-52 lg:h-56 bg-gray-50 flex items-center justify-center overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={product.variants[0]?.images[0] || "/placeholder-image.jpg"}
            alt={product.name}
            width={240}
            height={240}
            className="object-contain mx-auto p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 20vw"
          />
        </Link>

        {/* Product Flags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              NEW
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              FEATURED
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-1 z-10">
          <Link href={`/product/${product.slug}`}>
            <div
              className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm hover:bg-white hover:shadow-md transition-all duration-200 group-hover:scale-110"
              aria-label="View product details"
            >
              <Eye size={16} className="text-gray-700" />
            </div>
          </Link>
        </div>

        {/* Stock Status */}
        {inStockVariants.length === 0 && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4 lg:p-5 flex flex-col flex-grow">
        <Link href={`/product/${product.slug}`} className="block flex-grow">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base lg:text-lg mb-2 line-clamp-2 hover:text-indigo-600 transition-colors leading-tight">
            {product.name}
          </h3>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              {inStockVariants.length > 0 ? (
                <span className="text-indigo-700 font-bold text-lg lg:text-xl">
                  ${lowestPrice.toFixed(2)}
                </span>
              ) : (
                <span className="text-gray-500 font-medium text-lg lg:text-xl">
                  Out of stock
                </span>
              )}
            </div>
            <div className="flex items-center">
              <Rating rating={product.averageRating} />
              {product.reviewCount > 0 && (
                <span className="text-gray-500 text-xs lg:text-sm ml-1">
                  ({product.reviewCount})
                </span>
              )}
            </div>
          </div>

          {/* Category */}
          {product.category && (
            <div className="text-xs lg:text-sm text-gray-500 mb-2">
              {product.category.name}
            </div>
          )}
        </Link>

        {/* Quick Actions */}
        <div className="mt-auto pt-3 border-t border-gray-100">
          <button
            className="w-full bg-indigo-600 text-white py-2.5 lg:py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium text-sm lg:text-base"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
