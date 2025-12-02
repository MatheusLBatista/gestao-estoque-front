"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const { fotoPerfil } = useUserProfile();

  const userName: string = session?.user?.nome_usuario || "Usuário";
  
  // Gerar iniciais do nome para o fallback
  const userAbbreviation: string = userName
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    setOpen(false);
    router.push("/logout");
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="text-right">
            <h5 className="text-sm font-medium text-white mr-1.5">{userName}</h5>
          </div>

          <Avatar className="h-10 w-10">
            <AvatarImage src={fotoPerfil || "/foto-perfil.jpeg"} alt="User Avatar" />
            <AvatarFallback className="text-blue-700">{userAbbreviation}</AvatarFallback>
          </Avatar>

          <ChevronDown
            className={`w-4 h-4 text-white transition-transform duration-200 ${
              open ? "rotate-180" : ""
            } aria-hidden`}
          />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="flex flex-col gap-0.5 mt-2.5" align="end">
        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
         <DropdownMenuItem>
          Editar perfil
        </DropdownMenuItem>
         <DropdownMenuItem onClick={handleLogout}>
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
