"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { hasPermission, type RouteKey } from "@/lib/permissions";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoute: RouteKey;
  fallbackUrl?: string;
}

export function ProtectedRoute({
  children,
  requiredRoute,
  fallbackUrl = "/home",
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    const userRole = session.user?.perfil;
    if (!hasPermission(userRole, requiredRoute)) {
      router.push(fallbackUrl);
    }
  }, [session, status, requiredRoute, fallbackUrl, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session || !hasPermission(session.user?.perfil, requiredRoute)) {
    return null;
  }

  return <>{children}</>;
}
