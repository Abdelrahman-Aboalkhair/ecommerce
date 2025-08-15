"use client";
import { ReactNode } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { Shield, AlertTriangle } from "lucide-react";

interface PermissionGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
  showFallback?: boolean;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  allowedRoles,
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

  const hasPermission = allowedRoles.includes(user.role);

  if (!hasPermission) {
    return showFallback
      ? fallback || (
          <div className="flex items-center justify-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
            <Shield className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="text-yellow-700 text-sm">
              Insufficient permissions. Required roles:{" "}
              {allowedRoles.join(", ")}
            </span>
          </div>
        )
      : null;
  }

  return <>{children}</>;
};

export default PermissionGuard;
