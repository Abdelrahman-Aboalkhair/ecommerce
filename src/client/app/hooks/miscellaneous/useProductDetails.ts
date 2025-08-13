"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
} from "@/app/store/apis/ProductApi";
import { useGetAllCategoriesQuery } from "@/app/store/apis/CategoryApi";
import useToast from "@/app/hooks/ui/useToast";
import { ProductFormData } from "@/app/(private)/dashboard/products/product.types";

export const useProductDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  const {
    data: product,
    isLoading: productsLoading,
    error: productsError,
  } = useGetProductByIdQuery(id);

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetAllCategoriesQuery({});

  const categories =
    categoriesData?.categories.map((c) => ({
      label: c.name,
      value: c.id,
    })) || [];

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // Variant selection state
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});

  // Form setup with initial empty default values
  const form = useForm<ProductFormData>({
    defaultValues: {
      id: "",
      name: "",
      description: "",
      categoryId: "",
      isNew: false,
      isTrending: false,
      isBestSeller: false,
      isFeatured: false,
      variants: [],
    },
  });

  // Reset form and selected variant when product data is fetched
  useEffect(() => {
    if (product) {
      form.reset({
        id: product.id || "",
        name: product.name || "",
        description: product.description || "",
        categoryId: product.categoryId || "",
        isNew: product.isNew || false,
        isTrending: product.isTrending || false,
        isBestSeller: product.isBestSeller || false,
        isFeatured: product.isFeatured || false,
        variants:
          product.variants?.map((v) => ({
            id: v.id || "",
            sku: v.sku || "",
            price: v.price || 0,
            stock: v.stock || 0,
            lowStockThreshold: v.lowStockThreshold || 10,
            barcode: v.barcode || "",
            warehouseLocation: v.warehouseLocation || "",
            attributes: v.attributes || [],
            images: v.images || [],
          })) || [],
      });
      // Set default selected variant to the first one
      setSelectedVariant(product.variants?.[0] || null);
      setSelectedAttributes({});
    }
  }, [product, form]);

  // Handle variant change based on attribute selections
  const handleVariantChange = (attributeName, value) => {
    const newSelections = { ...selectedAttributes, [attributeName]: value };
    setSelectedAttributes(newSelections);

    const variant = product?.variants.find((v) =>
      Object.entries(newSelections).every(
        ([attrName, attrValue]) =>
          attrName === "" ||
          v.attributes.some(
            (attr) =>
              attr.attribute?.name === attrName &&
              attr.value?.value === attrValue
          )
      )
    );
    setSelectedVariant(variant || product?.variants?.[0] || null);
  };

  // Reset variant selections
  const resetSelections = () => {
    setSelectedAttributes({});
    setSelectedVariant(product?.variants?.[0] || null);
  };

  // Handle update
  const onSubmit = async (data: ProductFormData) => {
    const payload = new FormData();
    payload.append("name", data.name || "");
    payload.append("description", data.description || "");
    payload.append("isNew", data.isNew.toString());
    payload.append("isTrending", data.isTrending.toString());
    payload.append("isBestSeller", data.isBestSeller.toString());
    payload.append("isFeatured", data.isFeatured.toString());
    payload.append("categoryId", data.categoryId || "");

    // Handle variants
    data.variants.forEach((variant, index) => {
      payload.append(`variants[${index}][id]`, variant.id || "");
      payload.append(`variants[${index}][sku]`, variant.sku || "");
      payload.append(`variants[${index}][price]`, variant.price.toString());
      payload.append(`variants[${index}][stock]`, variant.stock.toString());
      payload.append(
        `variants[${index}][lowStockThreshold]`,
        variant.lowStockThreshold?.toString() || "10"
      );
      payload.append(`variants[${index}][barcode]`, variant.barcode || "");
      payload.append(
        `variants[${index}][warehouseLocation]`,
        variant.warehouseLocation || ""
      );
      payload.append(
        `variants[${index}][attributes]`,
        JSON.stringify(variant.attributes || [])
      );
      // Handle new image uploads
      if (variant.images && variant.images.length > 0) {
        variant.images.forEach((file) => {
          if (file instanceof File) {
            payload.append(`images`, file);
          }
        });
      }
    });

    try {
      await updateProduct({
        id: id as string,
        data: payload,
      }).unwrap();
      showToast("Product updated successfully", "success");
    } catch (err) {
      console.error("Failed to update product:", err);
      showToast("Failed to update product", "error");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await deleteProduct(id as string).unwrap();
      showToast("Product deleted successfully", "success");
      router.push("/dashboard/products");
    } catch (err) {
      console.error("Failed to delete product:", err);
      showToast("Failed to delete product", "error");
    }
  };

  // Compute attribute groups for variant selection
  const attributeGroups = product?.variants.reduce((acc, variant) => {
    const hasSelections = Object.values(selectedAttributes).some(
      (value) => value !== ""
    );
    const matchesSelections = hasSelections
      ? Object.entries(selectedAttributes).every(
          ([attrName, attrValue]) =>
            attrName === "" ||
            variant.attributes.some(
              (attr) =>
                attr.attribute?.name === attrName &&
                attr.value?.value === attrValue
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

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  return {
    product,
    categories,
    productsLoading,
    categoriesLoading,
    productsError,
    form,
    isUpdating,
    isDeleting,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    onSubmit,
    handleDelete,
    router,
    selectedVariant,
    setSelectedVariant,
    selectedAttributes,
    handleVariantChange,
    resetSelections,
    attributeGroups,
  };
};
