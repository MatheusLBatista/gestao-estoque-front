"use client";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { TypographyH2 } from "@/components/layout/subtitle";
import { Fornecedor } from "@/types/Fornecedor";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/services/api";
import { LoaderIcon } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import { useQueryState, parseAsInteger } from "nuqs";
import TabelaFornecedores from "@/components/layout/table/fornecedoresTable";

export default function FornecedoresPage() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limite, setLimite] = useQueryState(
    "limite",
    parseAsInteger.withDefault(10)
  );

  const {
    data: fornecedoresData,
    isLoading: fornecedoresIsLoading,
    isError: fornecedoresIsError,
    error: fornecedoresError,
  } = useQuery({
    queryKey: ["listaFornecedores", page, limite],
    queryFn: async () => {
      if (process.env.NEXT_PUBLIC_SIMULAR_ERRO === "true") {
        throw new Error("Erro simulado ao carregar dados de fornecedores");
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limite: limite.toString(),
      });

      const result = await fetchData<{
        data: {
          docs: Fornecedor[];
          totalDocs: number;
          totalPages: number;
          page: number;
          limit: number;
        };
      }>(`/fornecedores?${params.toString()}`, "GET");

      return result.data || [];
    },
    retry: false,
  });

  useEffect(() => {
    if (fornecedoresIsError) {
      toast.error("Erro ao carregar fornecedores", {
        description:
          (fornecedoresError as Error)?.message || "Erro desconhecido",
      });
    }

    if (fornecedoresData?.totalDocs) {
      toast.info("Fornecedores encontrados", {
        description: `${fornecedoresData.totalDocs} fornecedor(es) encontrado(s). Exibindo na página.`,
        duration: 2500,
      });
    }
  }, [
    fornecedoresIsError,
    fornecedoresError,
    fornecedoresData,
    limite,
    setLimite,
    setPage,
  ]);

  return (
    <div>
      <Header />

      <main className="min-h-screen p-8">
        <TypographyH2>Gestão de Fornecedores</TypographyH2>

        {fornecedoresIsLoading && (
          <LoaderIcon role="status" className="animate-spin mt-20 mx-auto" />
        )}

        {fornecedoresData && (
          <TabelaFornecedores
            fornecedores={fornecedoresData.docs}
            totalPages={fornecedoresData.totalPages}
            totalDocs={fornecedoresData.totalDocs}
            currentPage={fornecedoresData.page}
            perPage={fornecedoresData.limit}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}