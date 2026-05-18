"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { usePerfil } from "@/hooks/usePerfil";

export default function RoleGuard({ children, allowedRoles, redirectTo = "/" }) {
  const router = useRouter();
  const { loading, tipo } = usePerfil();

  useEffect(() => {
    if (loading) return;

    if (!allowedRoles.includes(tipo)) {
      router.replace(redirectTo);
    }
  }, [allowedRoles, loading, redirectTo, router, tipo]);

  if (loading || !allowedRoles.includes(tipo)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-900" />
      </div>
    );
  }

  return children;
}
