"use client";
import { Controller, UseFormReturn } from "react-hook-form";
import { UserPlus, Mail, User, Lock } from "lucide-react";

export interface CreateAdminFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface CreateAdminFormProps {
  form: UseFormReturn<CreateAdminFormData>;
  onSubmit: (data: CreateAdminFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const CreateAdminForm: React.FC<CreateAdminFormProps> = ({
  form,
  onSubmit,
  isLoading,
  submitLabel = "Create Admin",
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  const password = watch("password");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <div className="relative">
          <Controller
            name="name"
            control={control}
            rules={{
              required: "Name is required",
              minLength: {
                value: 3,
                message: "Name must be at least 3 characters long",
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                placeholder="John Doe"
              />
            )}
          />
          <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
        </div>
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
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
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                placeholder="john.doe@example.com"
              />
            )}
          />
          <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="password"
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                placeholder="Enter password"
              />
            )}
          />
          <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            }}
            render={({ field }) => (
              <input
                {...field}
                type="password"
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                placeholder="Confirm password"
              />
            )}
          />
          <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Role Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <UserPlus className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            Admin Account
          </span>
        </div>
        <p className="text-sm text-blue-700 mt-1">
          This user will be created with Admin privileges and can manage users
          and system settings.
        </p>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 flex items-center space-x-2 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>{isLoading ? "Creating..." : submitLabel}</span>
        </button>
      </div>
    </form>
  );
};

export default CreateAdminForm;
