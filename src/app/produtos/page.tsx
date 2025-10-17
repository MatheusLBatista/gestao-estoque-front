"use client";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { TypographyH2 } from "@/components/layout/subtitle";
import { useState, useEffect, use } from "react";
import TabelaProdutos from "@/components/layout/table/produtoTable";
import { Produto } from "../../lib/Produto";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/services/api";

export default function ProdutosPage() {
  const {
    data: produtosData,
    isLoading: produtosIsLoading,
    isError: produtosIsError,
    error: produtosError,
    refetch: produtosRefetch,
  } = useQuery({
    queryKey: ["listaProdutos"],
    queryFn: async () => {
      const result = await fetchData<{ data: { docs: Produto[] } }>(
        "/produtos?limite=20",
        "GET"
      );
      return result.data.docs || [];
    },
  });

  return (
    <div>
      <Header />

      <main className="min-h-screen p-8">
        <TypographyH2>Estoque de produtos</TypographyH2>

        {produtosIsLoading && <p>Carregando produtos...</p>}

        {produtosIsError && (
          <p className="text-red-500">
            Erro ao carregar produtos:{" "}
            {(produtosError as Error)?.message || "Erro desconhecido"}
          </p>
        )}

        {produtosData && <TabelaProdutos produtos={produtosData} />}
      </main>

      <Footer />
    </div>
  );
}
