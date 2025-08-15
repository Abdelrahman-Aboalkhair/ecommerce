"use client";
import { withAuth } from "@/app/components/HOC/WithAuth";
import MainLayout from "@/app/components/templates/MainLayout";
import { useGetMeQuery } from "@/app/store/apis/UserApi";
import {
  User,
  Shield,
  Mail,
  Calendar,
  Edit3,
  Camera,
  CheckCircle,
  AlertCircle,
  Settings,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

const UserProfile = () => {
  const { data, isLoading, error } = useGetMeQuery(undefined);
  const [isEditing, setIsEditing] = useState(false);

  console.log("user => ", data);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-4 sm:py-8 px-3 sm:px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="animate-pulse">
                {/* Header skeleton */}
                <div className="h-32 sm:h-40 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
                  <div className="absolute -bottom-8 sm:-bottom-12 left-4 sm:left-8">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-300 rounded-full border-4 border-white"></div>
                  </div>
                </div>

                {/* Content skeleton */}
                <div className="pt-12 sm:pt-16 p-4 sm:p-8">
                  <div className="space-y-4">
                    <div className="h-6 bg-gray-300 rounded w-48"></div>
                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="h-20 bg-gray-200 rounded-xl"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !data?.user) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-4 sm:py-8 px-3 sm:px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-red-100 p-6 sm:p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                  Profile Error
                </h3>
                <p className="text-red-600 text-sm sm:text-base">
                  Unable to fetch your profile. Please try again.
                </p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const { user } = data;

  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format role for display
  const formatRole = (role: string) => {
    return role.charAt(0) + role.slice(1).toLowerCase();
  };

  // Get role color
  const getRoleColor = (role: string) => {
    const colors = {
      USER: "bg-blue-100 text-blue-800 border-blue-200",
      ADMIN: "bg-purple-100 text-purple-800 border-purple-200",
      SUPERADMIN: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[role as keyof typeof colors] || colors.USER;
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-4 sm:py-8 px-3 sm:px-4">
        <div className="max-w-4xl mx-auto">
          {/* Main Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
          >
            {/* Header with gradient background */}
            <div className="relative h-32 sm:h-40 bg-gradient-to-r from-indigo-500 to-purple-600">
              <div className="absolute inset-0 bg-black/10"></div>

              {/* Avatar */}
              <div className="absolute -bottom-8 sm:-bottom-12 left-4 sm:left-8">
                <div className="relative group">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      width={96}
                      height={96}
                      alt="Profile"
                      className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-xl object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg sm:text-xl">
                        {getInitials(user.name || user.id)}
                      </span>
                    </div>
                  )}

                  {/* Edit avatar button */}
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                  </button>

                  {/* Online status */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors duration-200">
                  <Settings className="w-4 h-4" />
                </button>
                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors duration-200">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Profile Content */}
            <div className="pt-12 sm:pt-16 p-4 sm:p-8">
              {/* Header section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                    {user.name || "User Profile"}
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Manage your account information and preferences
                  </p>
                </div>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="mt-4 sm:mt-0 inline-flex items-center space-x-2 bg-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium shadow-lg hover:bg-indigo-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{isEditing ? "Save Changes" : "Edit Profile"}</span>
                </button>
              </div>

              {/* User Details Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Basic Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-200/50"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Basic Info
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Full Name</p>
                      <p className="text-gray-800 font-medium">
                        {user.name || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">User ID</p>
                      <p className="text-gray-600 font-mono text-xs break-all">
                        {user.id}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Contact Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 border border-green-200/50"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Contact
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Email Address
                      </p>
                      <p className="text-gray-800 font-medium break-all">
                        {user.email || "Not provided"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-green-600 font-medium">
                        Email verified
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Role & Status Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 sm:p-6 border border-purple-200/50"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Role & Status
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Account Role</p>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {formatRole(user.role)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600 font-medium">
                        Active
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Account Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 sm:p-6 border border-orange-200/50 sm:col-span-2 lg:col-span-1"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Account Info
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Member Since</p>
                      <p className="text-gray-800 font-medium">Recently</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                      <p className="text-gray-800 font-medium">Recently</p>
                    </div>
                  </div>
                </motion.div>

                {/* Quick Actions Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 sm:p-6 border border-gray-200/50 sm:col-span-2 lg:col-span-2"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Quick Actions
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Edit3 className="w-4 h-4 text-indigo-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        Edit Profile
                      </span>
                    </button>

                    <button className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        Security
                      </span>
                    </button>

                    <button className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        Notifications
                      </span>
                    </button>

                    <button className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <LogOut className="w-4 h-4 text-red-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        Sign Out
                      </span>
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default withAuth(UserProfile);
