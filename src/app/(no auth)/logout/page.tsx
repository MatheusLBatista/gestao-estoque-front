"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function LogoutPage() {
  useEffect(() => {
    let timeout = setTimeout(() => {
      signOut({ callbackUrl: "/login" });
    }, 100); // Pequeno delay opcional, 100ms

    return () => clearTimeout(timeout); // limpa timeout se desmontar rápido
  }, []);

  return (
    <div className="bg-white min-h-screen flex items-center justify-center text-2xl">
    </div>
  );
}

