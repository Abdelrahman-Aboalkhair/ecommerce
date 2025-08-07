"use client";
import React, { useState } from "react";
import {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/app/store/apis/CategoryApi";
import Table from "@/app/components/layout/Table";
import { motion } from "framer-motion";
import { Tag, Trash2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import Modal from "@/app/components/organisms/Modal";
import ConfirmModal from "@/app/components/organisms/ConfirmModal";
import CategoryForm, { CategoryFormData } from "./CategoryForm";
import useToast from "@/app/hooks/ui/useToast";
import { withAuth } from "@/app/components/HOC/WithAuth";

const CategoriesDashboard = () => {
  const { showToast } = useToast();
  const { data, isLoading, error } = useGetAllCategoriesQuery({});
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();
  const categories = data?.categories || [];

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const form = useForm<CategoryFormData>({
    defaultValues: { name: "", description: "", images: [] },
  });

  const columns = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (row) => (
        <span className="font-medium text-gray-800">{row?.name || "N/A"}</span>
      ),
    },
    {
      key: "description",
      label: "Description",
      sortable: true,
      render: (row) => (
        <span className="font-medium text-gray-800">{row?.name || "N/A"}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleDeletePrompt(row?.id)}
            className="p-1 text-red-500 hover:text-red-600 transition-colors duration-200"
            aria-label="Delete category"
            disabled={isDeleting}
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  const handleDeletePrompt = (id: string) => {
    if (!id) return;
    setCategoryToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete).unwrap();
      setIsConfirmModalOpen(false);
      setCategoryToDelete(null);
      showToast("Category deleted successfully", "success");
    } catch (err) {
      console.error("Failed to delete category:", err);
      showToast("Failed to delete category", "error");
    }
  };

  const onSubmit = async (formData: CategoryFormData) => {
    const payload = new FormData();

    payload.append("name", formData.name || "");
    payload.append("description", formData.description || "");

    if (data.images && Array.isArray(data.images)) {
      data.images.forEach((file: any) => {
        if (file instanceof File) {
          payload.append("images", file);
        }
      });
    }

    console.log("FormData payload:");
    for (const [key, value] of payload.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }

    try {
      await createCategory(payload).unwrap();
      setIsCreateModalOpen(false);
      form.reset({ name: "" });
      showToast("Category created successfully", "success");
    } catch (err) {
      console.error("Failed to create category:", err);
      showToast("Failed to create category", "error");
    }
  };

  return (
    <div className="max-w-7xl min-w-full px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center space-x-3">
          <Tag size={24} className="text-indigo-500" />
          <h1 className="text-2xl font-bold text-gray-800">
            Categories Dashboard
          </h1>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-300 flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Add Category</span>
        </button>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div className="text-center py-12">
          <Tag size={48} className="mx-auto text-gray-400 mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">Loading categories...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-lg text-red-500">
            Error loading categories:{" "}
            {(error as any)?.message || "Unknown error"}
          </p>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12">
          <Tag size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-lg text-gray-600">No categories available</p>
        </div>
      ) : (
        <Table
          data={categories}
          columns={columns}
          isLoading={isLoading}
          className="bg-white rounded-xl shadow-md border border-gray-100"
        />
      )}

      {/* Create Category Modal */}
      <Modal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Create Category
        </h2>
        <CategoryForm
          form={form}
          onSubmit={onSubmit}
          isLoading={isCreating}
          submitLabel="Create"
        />
      </Modal>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        message="Are you sure you want to delete this category? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
        title="Delete Category"
        type="danger"
      />
    </div>
  );
};

export default withAuth(CategoriesDashboard);
