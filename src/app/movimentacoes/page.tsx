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
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function MovimentacoesPage() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limite, setLimite] = useQueryState(
    "limite",
    parseAsInteger.withDefault(10)
  );

  const [produtosFilter, setProdutosFilter] = useQueryState(
    "nome_produto",
    parseAsString.withDefault("")
  );
  const [tipoProdutoFilter, setTipoProdutoFilter] = useQueryState(
    "tipo",
    parseAsString.withDefault("")
  );
  const [dataInicialFilter, setDataInicialFilter] = useQueryState(
    "data_inicio",
    parseAsString.withDefault("")
  );
  const [dataFinalFilter, setDataFinalFilter] = useQueryState(
    "data_fim",
    parseAsString.withDefault("")
  );

  const [produtos, setProdutos] = useState(produtosFilter);
  const [tipoProduto, setTipoProduto] = useState(tipoProdutoFilter);
  const [dataInicial, setDataInicial] = useState(dataInicialFilter);
  const [dataFinal, setDataFinal] = useState(dataFinalFilter);

  useEffect(() => {
    setProdutos(produtosFilter);
    setTipoProduto(tipoProdutoFilter);
    setDataInicial(dataInicialFilter);
    setDataFinal(dataFinalFilter);
  }, [produtosFilter, tipoProdutoFilter, dataInicialFilter, dataFinalFilter]);

  const {
    data: movimentacoesData,
    isLoading: movimentacoesIsLoading,
    isError: movimentacoesIsError,
    error: movimentacoesError,
  } = useQuery({
    queryKey: [
      "listarMovimentacoes",
      page,
      limite,
      produtosFilter,
      tipoProdutoFilter,
      dataInicialFilter,
      dataFinalFilter,
    ],
    queryFn: async () => {
      if (process.env.NEXT_PUBLIC_SIMULAR_ERRO === "true") {
        throw new Error("Erro simulado ao carregar os dados de movimentações");
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limite: limite.toString(),
        ...(produtosFilter ? { nome_produto: produtosFilter } : {}),
        ...(tipoProdutoFilter ? { tipo: tipoProdutoFilter } : {}),
        ...(dataInicialFilter ? { data_inicio: dataInicialFilter } : {}),
        ...(dataFinalFilter ? { data_fim: dataFinalFilter } : {}),
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
                if (!dataInicial || !dataFinal) {
                  toast.error(
                    "Data inicial e final são obrigatórias",
                    {
                      description:
                        "Informe tanto a data inicial quanto a data final para filtrar por período.",
                    }
                  );
                  setDataInicialFilter("");
                  setDataFinalFilter("");
                  return;
                }
                setProdutosFilter(produtos);
                setTipoProdutoFilter(tipoProduto);
                setDataInicialFilter(dataInicial);
                setDataFinalFilter(dataFinal);
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
