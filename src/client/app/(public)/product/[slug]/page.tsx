"use client";
import { useState } from "react";
import MainLayout from "@/app/components/templates/MainLayout";
import BreadCrumb from "@/app/components/feedback/BreadCrumb";
import { useParams } from "next/navigation";
import ProductImageGallery from "../ProductImageGallery";
import ProductInfo from "../ProductInfo";
import ProductReviews from "../ProductReviews";
import { useQuery } from "@apollo/client";
import { generateProductPlaceholder } from "@/app/utils/placeholderImage";
import { GET_SINGLE_PRODUCT } from "@/app/gql/Product";
import ProductDetailSkeletonLoader from "@/app/components/feedback/ProductDetailSkeletonLoader";
import { Product } from "@/app/types/productTypes";

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const { data, loading, error } = useQuery<{ product: Product }>(
    GET_SINGLE_PRODUCT,
    {
      variables: { slug: typeof slug === "string" ? slug : slug?.[0] || "" },
      fetchPolicy: "no-cache",
    }
  );
  console.log("product data:", data);

  const [selectedVariant, setSelectedVariant] = useState<
    Product["variants"][0] | null
  >(null);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});

  if (loading) return <ProductDetailSkeletonLoader />;

  if (error) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-lg text-red-500">
            Error loading product: {error.message}
          </p>
        </div>
      </MainLayout>
    );
  }

  const product = data?.product;

  if (!product) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">Product not found</p>
        </div>
      </MainLayout>
    );
  }

  const attributeGroups = product.variants.reduce((acc, variant) => {
    const hasSelections = Object.values(selectedAttributes).some(
      (value) => value !== ""
    );
    const matchesSelections = hasSelections
      ? Object.entries(selectedAttributes).every(
          ([attrName, attrValue]) =>
            attrName === "" ||
            variant.attributes.some(
              (attr) =>
                attr.attribute.name === attrName &&
                attr.value.value === attrValue
            )
        )
      : true;
    if (matchesSelections) {
      variant.attributes.forEach(({ attribute, value }) => {
        if (!acc[attribute.name]) {
          acc[attribute.name] = { values: new Set<string>() };
        }
        acc[attribute.name].values.add(value.value);
      });
    }
    return acc;
  }, {} as Record<string, { values: Set<string> }>);

  const resetSelections = () => {
    setSelectedAttributes({});
    setSelectedVariant(null);
  };

  const handleVariantChange = (attributeName: string, value: string) => {
    const newSelections = { ...selectedAttributes, [attributeName]: value };
    setSelectedAttributes(newSelections);
    const variant = product.variants.find((v) =>
      Object.entries(newSelections).every(
        ([attrName, attrValue]) =>
          attrName === "" ||
          v.attributes.some(
            (attr) =>
              attr.attribute.name === attrName && attr.value.value === attrValue
          )
      )
    );
    setSelectedVariant(variant || null);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <BreadCrumb />
          </div>
        </div>

        {/* Product Details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <ProductImageGallery
                images={product.variants.flatMap((v) => v.images)}
                defaultImage={
                  selectedVariant?.images[0] ||
                  product.variants[0]?.images[0] ||
                  generateProductPlaceholder(product.name)
                }
                name={product.name}
              />
            </div>

            {/* Product Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <ProductInfo
                id={product.id}
                name={product.name}
                averageRating={product.averageRating}
                reviewCount={product.reviewCount}
                description={product.description || "No description available"}
                variants={product.variants}
                selectedVariant={selectedVariant}
                onVariantChange={handleVariantChange}
                attributeGroups={attributeGroups}
                selectedAttributes={selectedAttributes}
                resetSelections={resetSelections}
              />
            </div>
          </div>
        </div>

        {/* Product Reviews */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <ProductReviews reviews={product.reviews} productId={product.id} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetailsPage;
