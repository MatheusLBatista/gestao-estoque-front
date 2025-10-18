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
import { useQueryState, parseAsInteger } from "nuqs";

export default function ProdutosPage() {
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limite] = useQueryState("limite", parseAsInteger.withDefault(20));

  const {
    data: produtosData,
    isLoading: produtosIsLoading,
    isError: produtosIsError,
    error: produtosError,
  } = useQuery({
    queryKey: ["listaProdutos", page, limite],
    queryFn: async () => {
      if (process.env.NEXT_PUBLIC_SIMULAR_ERRO === "true") {
        throw new Error("Erro simulado ao carregar dados de produtos");
      }

      const result = await fetchData<{
        data: {
          docs: Produto[];
          totalDocs: number;
          totalPages: number;
          page: number;
          limit: number;
        };
      }>(`/produtos?page=${page}&limite=${limite}`, "GET");

      return result.data || [];
    },
    retry: false,
  });

  useEffect(() => {
    if (produtosIsError) {
      toast.error("Erro ao carregar produtos", {
        description: (produtosError as Error)?.message || "Erro desconhecido",
      });
    }
  }, [produtosIsError, produtosError]);

  return (
    <div>
      <Header />

      <main className="min-h-screen p-8">
        <TypographyH2>Estoque de produtos</TypographyH2>

        {produtosIsLoading && (
          <LoaderIcon role="status" className="animate-spin mt-20 mx-auto" />
        )}

        {produtosData && (
          <TabelaProdutos
            produtos={produtosData.docs}
            totalPages={produtosData.totalPages}
            totalDocs={produtosData.totalDocs}
            currentPage={produtosData.page}
            perPage={produtosData.limit}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
