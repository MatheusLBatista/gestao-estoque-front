"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Se não está autenticado, redireciona para login
    if (status === "unauthenticated") {
      router.push("/login");
    }

    // Se a sessão tem erro de refresh token, faz logout
    if (status === "authenticated" && (session as any)?.error === "RefreshAccessTokenError") {
      signOut({ redirect: false }).then(() => {
        localStorage.removeItem("manterLogado");
        router.push("/login");
      });
    }
  }, [status, session, router]);



  // Se está autenticado, renderiza os filhos
  if (status === "authenticated") {
    return <>{children}</>;
  }

  // Evita renderizar algo antes da verificação
  return null;
}
