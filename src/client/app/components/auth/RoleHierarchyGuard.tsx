"use client";
import { ReactNode } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { Shield, AlertTriangle } from "lucide-react";

interface RoleHierarchyGuardProps {
  children: ReactNode;
  targetUserRole: string;
  targetUserId: string;
  fallback?: ReactNode;
  showFallback?: boolean;
}

const RoleHierarchyGuard: React.FC<RoleHierarchyGuardProps> = ({
  children,
  targetUserRole,
  targetUserId,
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

  // Check if user is trying to modify themselves
  if (user.id === targetUserId) {
    return showFallback
      ? fallback || (
          <div className="flex items-center justify-center p-6 bg-orange-50 rounded-lg border border-orange-200">
            <Shield className="w-5 h-5 text-orange-500 mr-2" />
            <span className="text-orange-700 text-sm">
              You cannot modify your own account from this interface
            </span>
          </div>
        )
      : null;
  }

  // Role hierarchy: SUPERADMIN > ADMIN > USER
  const getRoleHierarchy = (role: string): number => {
    const hierarchy: { [key: string]: number } = {
      USER: 1,
      ADMIN: 2,
      SUPERADMIN: 3,
    };
    return hierarchy[role] || 0;
  };

  const currentUserHierarchy = getRoleHierarchy(user.role);
  const targetUserHierarchy = getRoleHierarchy(targetUserRole);

  // Check if current user has higher or equal hierarchy than target user
  if (currentUserHierarchy <= targetUserHierarchy) {
    return showFallback
      ? fallback || (
          <div className="flex items-center justify-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
            <Shield className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="text-yellow-700 text-sm">
              Cannot modify users with equal or higher privileges
            </span>
          </div>
        )
      : null;
  }

  return <>{children}</>;
};

export default RoleHierarchyGuard;
