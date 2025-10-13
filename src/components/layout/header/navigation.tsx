"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname() || "/";

  const items = [
    { label: "Produtos", href: "/produtos" },
    { label: "Movimentações", href: "/movimentacoes" },
    { label: "Fornecedores", href: "/fornecedores" },
    { label: "Funcionários", href: "/funcionarios" },
  ];

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
