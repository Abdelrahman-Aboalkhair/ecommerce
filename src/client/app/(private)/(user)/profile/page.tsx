"use client";
import { withAuth } from "@/app/components/HOC/WithAuth";
import MainLayout from "@/app/components/templates/MainLayout";
import { useAuth } from "@/app/hooks/useAuth";
import { User, Shield, Clock } from "lucide-react";
import Image from "next/image";

const UserProfile = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <div className="animate-pulse flex flex-col items-center space-y-4">
              <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-red-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Profile Error
              </h3>
              <p className="text-red-600">
                Unable to fetch your profile. Please try again.
              </p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Generate initials for avatar fallback
  const getInitials = (id) => {
    return id.slice(0, 2).toUpperCase();
  };

  // Format role for display
  const formatRole = (role) => {
    return role.charAt(0) + role.slice(1).toLowerCase();
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Main Profile Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Header with gradient background */}
            <div className="relative h-32 bg-indigo-600">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute -bottom-12 left-8">
                <div className="relative">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      width={96}
                      height={96}
                      alt="Profile"
                      className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl bg-indigo-600 flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {getInitials(user.id)}
                      </span>
                    </div>
                  )}
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="pt-16 p-8">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column - Basic Info */}
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                      User Profile
                    </h1>
                    <p className="text-gray-600">
                      Manage your account information
                    </p>
                  </div>

                  {/* User Details Cards */}
                  <div className="grid gap-4">
                    {/* ID Card */}
                    <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-200/50">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                          <User className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                            User ID
                          </h3>
                          <p className="text-gray-800 font-mono text-sm break-all">
                            {user.id}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status Card */}
                    <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-200/50">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <Clock className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                            Account Status
                          </h3>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-gray-800 font-medium">
                              Active
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Role */}
                <div>
                  {/* Role Badge */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Role
                      </h3>
                      <div className="inline-flex items-center px-6 py-3 bg-indigo-600 rounded-xl shadow-lg">
                        <span className="font-bold text-lg text-white">
                          {formatRole(user.role)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Profile Button */}
              <div className="mt-8">
                <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:bg-indigo-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default withAuth(UserProfile);
