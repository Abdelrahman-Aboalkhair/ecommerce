"use client";
import Table from "@/app/components/layout/Table";
import {
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/app/store/apis/UserApi";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Loader2, AlertCircle, Pencil, Trash2, X } from "lucide-react";
import useToast from "@/app/hooks/ui/useToast";
import { useForm } from "react-hook-form";
import UserForm, { UserFormData } from "./UserForm";
import ConfirmModal from "@/app/components/organisms/ConfirmModal";
import { usePathname } from "next/navigation";
import ToggleableText from "@/app/components/atoms/ToggleableText";
import { withAuth } from "@/app/components/HOC/WithAuth";

const UsersDashboard = () => {
  const { showToast } = useToast();
  const pathname = usePathname();

  const shouldFetchUsers = pathname === "/dashboard/users";

  const { data, isLoading, error } = useGetAllUsersQuery(undefined, {
    skip: !shouldFetchUsers,
  });

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const users = data?.users || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserFormData | null>(null);
  console.log("editingUser => ", editingUser);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | number | null>(
    null
  );

  const form = useForm<UserFormData>({
    defaultValues: {
      id: "",
      name: "",
      email: "",
      role: "user",
      emailVerified: false,
    },
  });

  const columns = [
    {
      key: "id",
      label: "User ID",
      sortable: true,
      render: (row: any) => (
        <span className="text-sm text-gray-600 font-mono">
          <ToggleableText content={row?.id || "N/A"} truncateLength={5} />
        </span>
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (row: any) => (
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-800">{row.name}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      render: (row: any) => (
        <a
          href={`mailto:${row.email}`}
          className="text-sm text-blue-600 hover:underline"
        >
          {row.email}
        </a>
      ),
      sortable: true,
    },
    {
      key: "role",
      label: "Role",
      render: (row: any) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.role === "admin"
              ? "bg-purple-100 text-purple-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {row.role}
        </span>
      ),
      sortable: true,
    },
    {
      key: "emailVerified",
      label: "Verified",
      render: (row: any) => (
        <span
          className={`text-sm ${
            row.emailVerified ? "text-green-600" : "text-red-600"
          }`}
        >
          {row.emailVerified ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (row: any) => (
        <span className="text-sm text-gray-600">
          {new Date(row.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "updatedAt",
      label: "Updated",
      sortable: true,
      render: (row: any) => (
        <span className="text-sm text-gray-600">
          {new Date(row.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: any) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setEditingUser(row);
              form.reset(row);
              setIsModalOpen(true);
            }}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Pencil size={16} />
            Edit
          </button>
          <button
            onClick={() => {
              setUserToDelete(row.id);
              setIsConfirmModalOpen(true);
            }}
            className="text-red-600 hover:text-red-800 flex items-center gap-1"
            disabled={isDeleting}
          >
            <Trash2 size={16} />
            {isDeleting && userToDelete === row.id ? "Deleting..." : "Delete"}
          </button>
        </div>
      ),
    },
  ];

  const handleEditSubmit = async (data: UserFormData) => {
    try {
      await updateUser(data).unwrap();
      setIsModalOpen(false);
      setEditingUser(null);
      showToast("User updated successfully", "success");
    } catch (err) {
      console.error("Failed to update user:", err);
      showToast("Failed to update user", "error");
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete).unwrap();
      setIsConfirmModalOpen(false);
      setUserToDelete(null);
      showToast("User deleted successfully", "success");
    } catch (err) {
      console.error("Failed to delete user:", err);
      showToast("Failed to delete user", "error");
    }
  };

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="min-w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Users Dashboard
            </h1>
          </div>
          <div className="text-sm text-gray-500">
            {users.length} {users.length === 1 ? "user" : "users"} found
          </div>
        </div>

        {/* Card Container */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <span className="ml-2 text-gray-600">Loading users...</span>
            </div>
          )}

          {error && !isLoading && (
            <div className="flex items-center justify-center py-12 text-red-600">
              <AlertCircle className="h-8 w-8 mr-2" />
              <span>Error loading users. Please try again.</span>
            </div>
          )}

          {!isLoading && !error && (
            <Table
              data={users}
              columns={columns}
              isLoading={isLoading}
              className="w-full"
            />
          )}
        </motion.div>
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Edit User</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <UserForm
                form={form}
                onSubmit={handleEditSubmit}
                isLoading={isUpdating}
                submitLabel="Save Changes"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        message="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
        title="Delete User"
        type="danger"
      />
    </div>
  );
};

export default withAuth(UsersDashboard);
