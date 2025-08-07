"use client";
import { Archive, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface ProductSummaryProps {
  product: any;
  categories: any;
  selectedVariant: any; // Add this line
  attributeGroups: any;
  selectedAttributes: object;
  onVariantChange: (attributeName: any, value: any) => void;
  resetSelections: () => void;
  isUpdating: boolean;
  onSave: () => Promise<void>;
}

const ProductSummary: React.FC<ProductSummaryProps> = ({
  product,
  categories,
  isUpdating,
  onSave,
}) => {
  const router = useRouter();
  const formattedPrice =
    typeof product.price === "number"
      ? `$${product.price.toFixed(2)}`
      : "$0.00";
  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount
    ? `$${(product.price * (1 - product.discount / 100)).toFixed(2)}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100"
    >
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Product Summary</h2>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Product ID
            </label>
            <p className="font-medium text-gray-800 text-sm">{product.id}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Category
            </label>
            <p className="font-medium text-gray-800">
              {categories.find((c) => c.value === product.categoryId)?.label ||
                "Uncategorized"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Stock Level
            </label>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-800">
                {product.stock} units
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  product.stock > 10
                    ? "bg-green-100 text-green-700"
                    : product.stock > 0
                    ? "bg-amber-100 text-amber-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {product.stock > 10
                  ? "In Stock"
                  : product.stock > 0
                  ? "Low Stock"
                  : "Out of Stock"}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Price Details
            </label>
            <div>
              <p className="font-medium text-gray-800">
                Base Price: {formattedPrice}
              </p>
              {hasDiscount && (
                <>
                  <p className="text-sm text-gray-600">
                    Discount: {product.discount}%
                  </p>
                  <p className="font-medium text-indigo-600">
                    Final Price: {discountedPrice}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="text-base font-medium text-gray-800 mb-4">
            Quick Actions
          </h3>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              onClick={onSave}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() =>
                router.push(`/dashboard/products/inventory/${product.id}`)
              }
            >
              <Archive size={16} />
              Manage Inventory
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductSummary;
