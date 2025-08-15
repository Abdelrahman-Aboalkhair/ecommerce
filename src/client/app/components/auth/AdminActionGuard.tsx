"use client";
import { ReactNode } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { Crown, AlertTriangle } from "lucide-react";

interface AdminActionGuardProps {
  children: ReactNode;
  action: "create_admin" | "delete_user" | "update_user";
  fallback?: ReactNode;
  showFallback?: boolean;
}

const AdminActionGuard: React.FC<AdminActionGuardProps> = ({
  children,
  action,
  fallback,
  showFallback = true,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return showFallback ? (
      <div className="flex items-center justify-center p-6 bg-red-50 rounded-lg border border-red-200">
        <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
        <span className="text-red-700 text-sm">Authentication required</span>
      </div>
    ) : null;
  }

  // Check permissions based on action and user role
  const hasPermission = (() => {
    switch (action) {
      case "create_admin":
        // Only SUPERADMIN can create new admins
        return user.role === "SUPERADMIN";
      case "delete_user":
        // ADMIN and SUPERADMIN can delete users (with hierarchy checks)
        return user.role === "ADMIN" || user.role === "SUPERADMIN";
      case "update_user":
        // ADMIN and SUPERADMIN can update users (with hierarchy checks)
        return user.role === "ADMIN" || user.role === "SUPERADMIN";
      default:
        return false;
    }
  })();

  if (!hasPermission) {
    return showFallback
      ? fallback || (
          <div className="flex items-center justify-center p-6 bg-purple-50 rounded-lg border border-purple-200">
            <Crown className="w-5 h-5 text-purple-500 mr-2" />
            <span className="text-purple-700 text-sm">
              {action === "create_admin"
                ? "Only SuperAdmins can create new admins"
                : "Admin privileges required for this action"}
            </span>
          </div>
        )
      : null;
  }

  return <>{children}</>;
};

export default AdminActionGuard;
