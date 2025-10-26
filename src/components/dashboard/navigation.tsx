"use client";

import { Package, FileText } from "lucide-react";
import { StatCard as StatCardType, ModuleCard as ModuleCardType } from "@/types/Dashboard";

export default function DashboardNavigation() {
  const statCards: StatCardType[] = [
    {
      id: "categoria-a",
      title: "Categoria",
      value: "A",
      icon: Package,
    },
    {
      id: "categoria-b",
      title: "Categoria",
      value: "B",
      icon: Package,
    },
    {
      id: "categoria-c",
      title: "Categoria", 
      value: "C",
      icon: Package,
    },
    {
      id: "saidas",
      title: "Saídas",
      value: "R$120.000,00",
      icon: FileText,
    },
  ];

  const moduleCards: ModuleCardType[] = [
    {
      id: "produtos",
      title: "Produtos",
      description: "Cadastre e gerencie seus produtos",
      iconSrc: "/produtos_icon.png",
      iconAlt: "Produtos",
      href: "/produtos",
    },
    {
      id: "fornecedores",
      title: "Fornecedores",
      description: "Acesse o cadastro de fornecedores",
      iconSrc: "/fornecedores_icon.png",
      iconAlt: "Fornecedores",
      href: "/fornecedores",
    },
    {
      id: "movimentacoes",
      title: "Movimentações",
      description: "Gerencie suas movimentações",
      iconSrc: "/movimentacoes_icon.png",
      iconAlt: "Movimentações",
      href: "/movimentacoes",
    },
    {
      id: "funcionarios",
      title: "Funcionários",
      description: "Acesse o cadastro de funcionários",
      iconSrc: "/funcionarios_icon.png",
      iconAlt: "Funcionários",
      href: "/funcionarios",
    },
  ];

  return {
    statCards,
    moduleCards,
  };
}
