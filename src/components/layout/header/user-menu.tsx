"use client";
import { useState } from "react";
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

  return (
    // <div className="flex items-center space-x-3 cursor-pointer">

    // </div>

    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="text-right">
            <h5 className="text-sm font-medium text-white mr-1.5">Anna Cors</h5>
          </div>

          <Avatar className="h-10 w-10">
            <AvatarImage src="/avatar.png" alt="User Avatar" />
            <AvatarFallback>AC</AvatarFallback>
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
         <DropdownMenuItem>
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
