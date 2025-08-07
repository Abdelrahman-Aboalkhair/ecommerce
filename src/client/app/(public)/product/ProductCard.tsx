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
      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden relative h-full flex flex-col"
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative w-full h-40 bg-gray-50 flex items-center justify-center overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={product.variants[0]?.images[0] || "/placeholder-image.jpg"}
            alt={product.name}
            width={160}
            height={160}
            className="object-contain mx-auto"
          />
        </Link>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex space-x-1 z-10">
          <Link href={`/product/${product.slug}`}>
            <div
              className="bg-white rounded-full p-1.5 shadow-sm hover:bg-gray-100 transition"
              aria-label="View product details"
            >
              <Eye size={16} className="text-gray-600" />
            </div>
          </Link>
        </div>
      </div>

      <div className="p-3 flex flex-col flex-grow">
        <Link href={`/product/${product.slug}`} className="block flex-grow">
          <h3 className="font-medium text-gray-800 text-base mb-1.5 line-clamp-1 hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5">
              {inStockVariants.length > 0 ? (
                <span className="text-indigo-700 font-medium text-sm">
                  From ${lowestPrice.toFixed(2)}
                </span>
              ) : (
                <span className="text-gray-500 font-medium text-sm">
                  Out of stock
                </span>
              )}
            </div>
            <div className="flex items-center">
              <Rating rating={product.averageRating} />
              {/* <span className="text-gray-500 text-xs ml-1">
                ({product.reviewCount || 0} reviews)
              </span> */}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
