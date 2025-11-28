"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { getAllowedRoutes, type RouteKey } from "@/lib/permissions";

export default function Navigation() {
  const pathname = usePathname() || "/";
  const { data: session } = useSession();

  const allItems: Array<{ label: string; href: string; key: RouteKey }> = [
    { label: "Produtos", href: "/produtos", key: "produtos" },
    { label: "Movimentações", href: "/movimentacoes", key: "movimentacoes" },
    { label: "Fornecedores", href: "/fornecedores", key: "fornecedores" },
    { label: "Funcionários", href: "/funcionarios", key: "funcionarios" },
  ];

  const allowedRoutes = getAllowedRoutes(session?.user?.perfil);
  const items = allItems.filter((item) => allowedRoutes.includes(item.key));

  return (
    <nav>
      <ul className="flex items-center space-x-4">
        {items.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "text-white hover:bg-blue-700/80"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
