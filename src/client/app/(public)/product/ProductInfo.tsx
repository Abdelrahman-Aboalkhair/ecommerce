"use client";
import Rating from "@/app/components/feedback/Rating";
import { useAddToCartMutation } from "@/app/store/apis/CartApi";
import useToast from "@/app/hooks/ui/useToast";
import { Product } from "@/app/gql/Product";
import { Palette, Ruler, Info, Package } from "lucide-react";

interface ProductInfoProps {
  id: string;
  name: string;
  averageRating: number;
  reviewCount: number;
  description: string;
  variants: Product["variants"];
  selectedVariant: Product["variants"][0] | null;
  onVariantChange: (attributeName: string, value: string) => void;
  attributeGroups: Record<string, { values: Set<string> }>;
  selectedAttributes: Record<string, string>;
  resetSelections: () => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  name,
  averageRating,
  reviewCount,
  description,
  variants,
  selectedVariant,
  onVariantChange,
  attributeGroups,
  selectedAttributes,
  resetSelections,
}) => {
  const { showToast } = useToast();
  const [addToCart, { isLoading }] = useAddToCartMutation();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selectedVariant) {
      showToast("Please select a valid variant", "error");
      return;
    }
    try {
      await addToCart({
        variantId: selectedVariant.id,
        quantity: 1,
      });
      showToast("Product added to cart", "success");
    } catch (error: any) {
      showToast(error.data?.message || "Failed to add to cart", "error");
      console.error("Error adding to cart:", error);
    }
  };

  const price = selectedVariant
    ? selectedVariant.price
    : variants[0]?.price || 0;
  const stock = selectedVariant
    ? selectedVariant.stock
    : variants[0]?.stock || 0;

  // Compute available colors and sizes
  const colorValues = new Set<string>();
  const sizeValues = new Set<string>();
  variants.forEach((variant) => {
    variant.attributes.forEach(({ attribute, value }) => {
      if (attribute.name.toLowerCase() === "color") {
        colorValues.add(value.value);
      } else if (attribute.name.toLowerCase() === "size") {
        sizeValues.add(value.value);
      }
    });
  });

  // Generate attribute summary
  const attributeSummary = Object.entries(attributeGroups)
    .map(([attrName, { values }]) => {
      const valueList = Array.from(values).join(", ");
      return `${
        attrName.charAt(0).toUpperCase() + attrName.slice(1)
      }: ${valueList}`;
    })
    .join("; ");

  return (
    <div className="flex flex-col gap-4 px-4 sm:px-6 py-4">
      {/* Product Name */}
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
        {name}
      </h1>

      {/* Rating and Stock */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
        <Rating rating={averageRating} />
        <span>({reviewCount || 0} reviews)</span>
        <span
          className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
            stock > 0
              ? "bg-indigo-100 text-indigo-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {stock > 0 ? `${stock} in stock` : "Out of stock"}
        </span>
      </div>

      {/* Price */}
      <div className="text-lg sm:text-xl font-semibold text-gray-800">
        ${price.toFixed(2)}
      </div>

      {/* Available Options */}
      <div className="space-y-2">
        {colorValues.size > 0 && (
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600 text-xs sm:text-sm">
              Available in {colorValues.size}{" "}
              {colorValues.size === 1 ? "color" : "colors"}
            </span>
          </div>
        )}

        {sizeValues.size > 0 && (
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600 text-xs sm:text-sm">
              Available in {sizeValues.size}{" "}
              {sizeValues.size === 1 ? "size" : "sizes"}
            </span>
          </div>
        )}

        {attributeSummary && (
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600 text-xs sm:text-sm">
              {attributeSummary}
            </span>
          </div>
        )}

        {colorValues.size === 0 &&
          sizeValues.size === 0 &&
          attributeSummary === "" && (
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500 text-xs sm:text-sm">
                No options available
              </span>
            </div>
          )}
      </div>

      {/* Variant Selection */}
      <div className="mt-3">
        {Object.entries(attributeGroups).map(([attributeName, { values }]) => (
          <div key={attributeName} className="mb-3">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 capitalize">
              {attributeName}
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs sm:text-sm"
              onChange={(e) => onVariantChange(attributeName, e.target.value)}
              value={selectedAttributes[attributeName] || ""}
            >
              <option value="">Select {attributeName}</option>
              {Array.from(values).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button
          onClick={resetSelections}
          className="mt-2 px-4 py-1.5 text-xs sm:text-sm font-medium text-indigo-600 border border-indigo-600 rounded hover:bg-indigo-50 transition-colors"
        >
          Reset Selections
        </button>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mt-2">
        {description}
      </p>

      {/* Action Buttons */}
      <div className="mt-3 flex flex-col sm:flex-row gap-2">
        <button
          disabled={!stock || isLoading || !selectedVariant}
          onClick={handleAddToCart}
          className={`w-full py-2 text-xs sm:text-sm font-medium text-white rounded transition-colors ${
            isLoading || !stock || !selectedVariant
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {stock > 0 && selectedVariant ? "Add to Cart" : "Select a Variant"}
        </button>
        <button
          disabled={!stock || !selectedVariant}
          className={`w-full py-2 text-xs sm:text-sm font-medium border rounded transition-colors ${
            stock && selectedVariant
              ? "border-indigo-600 text-indigo-600 hover:bg-indigo-50"
              : "border-gray-300 text-gray-400 cursor-not-allowed"
          }`}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
