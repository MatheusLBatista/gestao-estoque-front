"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);



  // Se está autenticado, renderiza os filhos
  if (status === "authenticated") {
    return <>{children}</>;
  }

  // Evita renderizar algo antes da verificação
  return null;
}
