"use client";
import React, { useEffect } from "react";
import { Eye } from "lucide-react";
import { Product } from "@/app/types/productTypes";
import Image from "next/image";
import Link from "next/link";
import Rating from "@/app/components/feedback/Rating";
import useTrackInteraction from "@/app/hooks/miscellaneous/useTrackInteraction";
import { useRouter } from "next/navigation";
import { generateProductPlaceholder } from "@/app/utils/placeholderImage";

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
      className="group bg-white rounded-sm border border-gray-100 overflow-hidden
       relative h-full flex flex-col"
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative w-full h-48 sm:h-[170px]  bg-gray-50 flex items-center justify-center overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={
              product.variants[0]?.images[0] ||
              generateProductPlaceholder(product.name)
            }
            alt={product.name}
            width={240}
            height={240}
            className="object-contain mx-auto p-4"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 20vw"
            onError={(e) => {
              e.currentTarget.src = generateProductPlaceholder(product.name);
            }}
          />
        </Link>

        {/* Product Flags */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              NEW
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-purple-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              FEATURED
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex space-x-1 z-10">
          <Link href={`/product/${product.slug}`}>
            <div
              className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm "
              aria-label="View product details"
            >
              <Eye size={14} className="text-gray-700" />
            </div>
          </Link>
        </div>

        {/* Stock Status */}
        {inStockVariants.length === 0 && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 lg:p-5 flex flex-col flex-grow">
        <Link href={`/product/${product.slug}`} className="block flex-grow">
          <h3 className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base mb-2 line-clamp-2 leading-tight">
            {product.name}
          </h3>

          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center space-x-2">
              {inStockVariants.length > 0 ? (
                <span className="text-indigo-700 font-bold text-sm sm:text-lg lg:text-xl">
                  ${lowestPrice.toFixed(2)}
                </span>
              ) : (
                <span className="text-gray-500 font-medium text-sm sm:text-lg lg:text-xl">
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
        <div className="mt-auto pt-2 sm:pt-3 border-t border-gray-100">
          <button
            className="w-full bg-indigo-600 text-white py-2 sm:py-2.5 lg:py-3 rounded-sm
              font-medium text-xs sm:text-sm"
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
