"use client";

import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { TypographyH2 } from "@/components/layout/subtitle";
import TabelaMovimentacao from "@/components/layout/table/movimentacaoTable";
import { fetchData } from "@/services/api";
import { Movimentacao } from "@/types/Movimentacao";
import { useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useEffect } from "react";
import { toast } from "sonner";

export default function MovimentacoesPage() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limite, setLimite] = useQueryState(
    "limite",
    parseAsInteger.withDefault(10)
  );
  const [produtos, setProdutos] = useQueryState(
    "produtos",
    parseAsString.withDefault("")
  );
  const [tipoProduto, setTipoProduto] = useQueryState(
    "tipo",
    parseAsString.withDefault("")
  );
  const [dataInicial, setDataInicial] = useQueryState(
    "data_inicio",
    parseAsString.withDefault("")
  );
  const [dataFinal, setDataFinal] = useQueryState(
    "data_fim",
    parseAsString.withDefault("")
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
        ...(produtos ? { produtos } : {}),
        ...(tipoProduto ? { tipo: tipoProduto } : {}),
        ...(dataInicial ? { data_inicial: dataInicial } : {}),
        ...(dataFinal ? { data_final: dataFinal } : {}),
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
  }, [
    movimentacoesError,
    movimentacoesIsError,
    movimentacoesData,
    limite,
    setLimite,
    setPage,
  ]);

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
            filtros={{
              produtos,
              setProdutos,
              tipoProduto,
              setTipoProduto,
              dataInicial,
              setDataInicial,
              dataFinal,
              setDataFinal,
              onSubmit: () => {
                setPage(1);
              },
            }}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
