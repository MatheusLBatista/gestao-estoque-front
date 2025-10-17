"use client";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { TypographyH2 } from "@/components/layout/subtitle";
import TabelaProdutos from "@/components/layout/table/produtoTable";
import { Produto } from "../../lib/Produto";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/services/api";
import { LoaderIcon } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

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
      if (process.env.NEXT_PUBLIC_SIMULAR_ERRO === "true") {
        throw new Error("Erro simulado ao carregar dados");
      }

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

        {produtosIsLoading && (
          <LoaderIcon role="status" className="animate-spin mt-20 mx-auto" />
        )}

        {produtosIsError && (
          toast.error("Erro ao carregar produtos", {
            description: (produtosError as Error)?.message || "Erro desconhecido",
          })
        )}

        {produtosData && <TabelaProdutos produtos={produtosData} />}
      </main>

      <Footer />
    </div>
  );
}
