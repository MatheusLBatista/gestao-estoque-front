"use client";

import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { TypographyH2 } from "@/components/layout/subtitle";
import TabelaMovimentacao from "@/components/layout/table/movimentacaoTable";
import { fetchData } from "@/services/api";
import { Movimentacao } from "@/types/Movimentacao";
import { useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect } from "react";
import { toast } from "sonner";

export default function MovimentacoesPage() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limite, setLimite] = useQueryState(
    "limite",
    parseAsInteger.withDefault(10)
  );

  const {
    data: movimentacoesData,
    isLoading: movimentacoesIsLoading,
    isError: movimentacoesIsError,
    error: movimentacoesError,
  } = useQuery({
    queryKey: ["listarMovimentacoes", page, limite],
    queryFn: async () => {
      if (process.env.NEXT_PUBLIC_SIMULAR_ERRO === "true") {
        throw new Error("Erro simulado ao carregar os dados de movimentações");
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limite: limite.toString(),
      });

      const result = await fetchData<{
        data: {
          docs: Movimentacao[];
          totalDocs: number;
          totalPages: number;
          page: number;
          limit: number;
        };
      }>(`/movimentacoes?${params.toString()}`, "GET");

      return result.data || [];
    },
  });

  useEffect(() => {
    if (movimentacoesIsError) {
      toast.error("Erro ao carregar movimentações", {
        description:
          (movimentacoesError as Error).message || "Erro desconhecido",
      });
    }

    if (movimentacoesData?.docs) {
      toast.info("Movimentações encontradas", {
        description: `${movimentacoesData.totalDocs} movimentações encontrada(s). Exibindo na página.`,
        duration: 2500,
      });
    }
  }, [movimentacoesError, movimentacoesIsError, movimentacoesData, limite, setLimite, setPage]);

  return (
    <div>
      <Header />

      <main className="min-h-screen p-8">
        <TypographyH2>Estoque de movimentações</TypographyH2>

        {movimentacoesIsLoading && (
          <LoaderIcon role="status" className="animate-spin mt-20 mx-auto" />
        )}

        {movimentacoesData && (
          <TabelaMovimentacao
            movimentacoes={movimentacoesData.docs}
            totalPages={movimentacoesData.totalPages}
            totalDocs={movimentacoesData.totalDocs}
            currentPage={movimentacoesData.page}
            perPage={movimentacoesData.limit}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
