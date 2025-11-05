"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { LoaderIcon } from "lucide-react";


export default function LogoutPage() {
  useEffect(() => {
    const performLogout = async () => {
      // Remove a flag de manter logado
      localStorage.removeItem("manterLogado");
      await signOut({ callbackUrl: "/login", redirect: true });
    };
    
    performLogout();
  }, []);

  return (
    <div className="bg- white min-h-screen flex items-center justify-center text-2xl">
        <LoaderIcon role="status" className="animate-spin mt-20 mx-auto" />
        
    </div>
  );
}

