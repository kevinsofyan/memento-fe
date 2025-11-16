"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { useUser } from "@/lib/api/hooks";
import { queryClient } from "@/lib/providers/query-client";
import { Loader2 } from "lucide-react";

export default function LogoutPage() {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const { clearUser } = useUser();

  useEffect(() => {
    const performLogout = async () => {
      clearAuth();
      clearUser();
      queryClient.clear();

      localStorage.removeItem("memento-auth-storage");
      localStorage.removeItem("user-storage");
      localStorage.removeItem("books-storage");
      localStorage.removeItem("entries-storage");

      try {
        await fetch("/api/logout");
      } catch (error) {
        console.error("Logout error:", error);
      }

      router.push("/login");
      router.refresh();
    };

    performLogout();
  }, [router, clearAuth, clearUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Signing out...</p>
      </div>
    </div>
  );
}

