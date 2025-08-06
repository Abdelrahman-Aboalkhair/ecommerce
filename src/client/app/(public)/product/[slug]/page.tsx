"use client";
import { useState } from "react";
import MainLayout from "@/app/components/templates/MainLayout";
import BreadCrumb from "@/app/components/feedback/BreadCrumb";
import { useParams } from "next/navigation";
import ProductImageGallery from "../ProductImageGallery";
import ProductInfo from "../ProductInfo";
import ProductReviews from "../ProductReviews";
import { useQuery } from "@apollo/client";
import { GET_SINGLE_PRODUCT, Product } from "@/app/gql/Product";
import CustomLoader from "@/app/components/feedback/CustomLoader";

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const { data, loading, error } = useQuery<{ product: Product }>(
    GET_SINGLE_PRODUCT,
    {
      variables: { slug: typeof slug === "string" ? slug : slug[0] },
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

  if (loading) return <CustomLoader />;

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 sm:mt-8">
        <BreadCrumb />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 bg-white rounded-lg shadow-sm">
        <ProductImageGallery
          images={product.variants.flatMap((v) => v.images)}
          defaultImage={
            selectedVariant?.images[0] ||
            product.variants[0]?.images[0] ||
            "/placeholder-image.jpg"
          }
          name={product.name}
        />
        <div>
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <ProductReviews reviews={product.reviews} productId={product.id} />
      </div>
    </MainLayout>
  );
};

export default ProductDetailsPage;
