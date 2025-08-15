"use client";

import { Controller, UseFormReturn } from "react-hook-form";
import { Users, Shield, Crown } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";

export interface UserFormData {
  id: string | number;
  name: string;
  email: string;
  role: "USER" | "ADMIN" | "SUPERADMIN";
  emailVerified: boolean;
}

interface UserFormProps {
  form: UseFormReturn<UserFormData>;
  onSubmit: (data: UserFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const UserForm: React.FC<UserFormProps> = ({
  form,
  onSubmit,
  isLoading,
  submitLabel = "Save",
}) => {
  const { user: currentUser } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = form;

  const selectedRole = watch("role");

  // Get role color for display
  const getRoleColor = (role: string) => {
    const colors = {
      USER: "bg-blue-100 text-blue-800 border-blue-200",
      ADMIN: "bg-purple-100 text-purple-800 border-purple-200",
      SUPERADMIN: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[role as keyof typeof colors] || colors.USER;
  };

  // Get available roles based on current user's role
  const getAvailableRoles = () => {
    if (!currentUser) return [];

    switch (currentUser.role) {
      case "SUPERADMIN":
        return [
          { value: "USER", label: "User", icon: <Users className="w-4 h-4" /> },
          {
            value: "ADMIN",
            label: "Admin",
            icon: <Shield className="w-4 h-4" />,
          },
          {
            value: "SUPERADMIN",
            label: "Super Admin",
            icon: <Crown className="w-4 h-4" />,
          },
        ];
      case "ADMIN":
        return [
          { value: "USER", label: "User", icon: <Users className="w-4 h-4" /> },
          {
            value: "ADMIN",
            label: "Admin",
            icon: <Shield className="w-4 h-4" />,
          },
        ];
      default:
        return [
          { value: "USER", label: "User", icon: <Users className="w-4 h-4" /> },
        ];
    }
  };

  const availableRoles = getAvailableRoles();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name
        </label>
        <div className="relative">
          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                placeholder="John Doe"
              />
            )}
          />
          <Users className="absolute left-3 top-3.5 text-gray-400" size={18} />
        </div>
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email format",
            },
          }}
          render={({ field }) => (
            <input
              {...field}
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              placeholder="john.doe@example.com"
            />
          )}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Role
        </label>
        <Controller
          name="role"
          control={control}
          rules={{ required: "Role is required" }}
          render={({ field }) => (
            <div className="space-y-2">
              <select
                {...field}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              >
                {availableRoles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>

              {/* Role Preview */}
              {selectedRole && (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
                  {availableRoles.find((r) => r.value === selectedRole)?.icon}
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                      selectedRole
                    )}`}
                  >
                    {
                      availableRoles.find((r) => r.value === selectedRole)
                        ?.label
                    }
                  </span>
                </div>
              )}
            </div>
          )}
        />
        {errors.role && (
          <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
        )}
      </div>

      {/* Email Verified */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Verified
        </label>
        <Controller
          name="emailVerified"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              value={field.value ? "true" : "false"}
              onChange={(e) => field.onChange(e.target.value === "true")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          )}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
