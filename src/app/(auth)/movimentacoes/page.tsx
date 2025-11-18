"use client";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { TypographyH2 } from "@/components/layout/subtitle";
import TabelaMovimentacao from "@/components/layout/table/movimentacaoTable";
import { MovimentacoesFilter } from "@/components/layout/filters/movimentacoesFilter";
import { CadastroMovimentacao } from "@/components/layout/popUp/movimentacoes/movimentacaoCadastro";
import { fetchData } from "@/services/api";
import { Movimentacao } from "@/types/Movimentacao";
import { AdjustDate } from "@/lib/adjustDate";
import { useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function MovimentacoesPage() {
  const { data: session, status } = useSession();

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

  const [movimentacaoFilter, setMovimentacaoFilter] = useQueryState(
    "movimentacao",
    parseAsString.withDefault("")
  );
  const [produtos, setProdutos] = useState(produtosFilter);
  const [movimentacao, setMovimentacao] = useState(movimentacaoFilter);
  const [tipoProduto, setTipoProduto] = useState(tipoProdutoFilter);
  const [dataInicial, setDataInicial] = useState(dataInicialFilter);
  const [dataFinal, setDataFinal] = useState(dataFinalFilter);
  const [cadastroOpen, setCadastroOpen] = useState<boolean>(false);

  const resetFilters = () => {
    setProdutos("");
    setMovimentacao("");
    setTipoProduto("");
    setDataInicial("");
    setDataFinal("");
    setProdutosFilter("");
    setMovimentacaoFilter("");
    setTipoProdutoFilter("");
    setDataInicialFilter("");
    setDataFinalFilter("");
    setPage(1);
  };

  useEffect(() => {
    setMovimentacao(movimentacaoFilter);
    setProdutos(produtosFilter);
    setTipoProduto(tipoProdutoFilter);
    setDataInicial(dataInicialFilter);
    setDataFinal(dataFinalFilter);
  }, [
    movimentacaoFilter,
    produtosFilter,
    tipoProdutoFilter,
    dataInicialFilter,
    dataFinalFilter,
  ]);

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
      movimentacaoFilter,
      produtosFilter,
      tipoProdutoFilter,
      dataInicialFilter,
      dataFinalFilter,
      session?.user?.accesstoken,
    ],
    queryFn: async () => {
      if (process.env.NEXT_PUBLIC_SIMULAR_ERRO === "true") {
        throw new Error("Erro simulado ao carregar os dados de movimentações");
      }

      if (!session?.user?.accesstoken) {
        throw new Error("Usuário não autenticado");
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limite: limite.toString(),
        ...(movimentacaoFilter ? { movimentacao: movimentacaoFilter } : {}),
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
      }>(
        `/movimentacoes?${params.toString()}`,
        "GET",
        session.user.accesstoken
      );

      if (result.data?.docs) {
        result.data.docs = result.data.docs.map((movimentacao) => ({
          ...movimentacao,
          data_movimentacao: movimentacao.data_movimentacao
            ? AdjustDate(movimentacao.data_movimentacao)
            : AdjustDate(movimentacao.data_cadastro),
          data_cadastro: AdjustDate(movimentacao.data_cadastro),
          data_ultima_atualizacao: AdjustDate(
            movimentacao.data_ultima_atualizacao
          ),
          ...(movimentacao.tipo === "entrada" &&
            (movimentacao as any).nota_fiscal?.data_emissao && {
              nota_fiscal: {
                ...(movimentacao as any).nota_fiscal,
                data_emissao: AdjustDate(
                  (movimentacao as any).nota_fiscal.data_emissao
                ),
              },
            }),
        }));
      }

      return result.data || [];
    },
    retry: false,
    enabled: status === "authenticated" && !!session?.user?.accesstoken,
  });

  useEffect(() => {
    if (movimentacoesIsError) {
      let errorMessage = "Erro desconhecido";

      if (movimentacoesError && typeof movimentacoesError === "object") {
        const errorObj = movimentacoesError as any;
        const rawMessage = errorObj?.response?.data?.message;

        if (rawMessage) {
          try {
            const parsedError = JSON.parse(rawMessage);

            if (Array.isArray(parsedError) && parsedError.length > 0) {
              const firstError = parsedError[0];
              errorMessage = firstError.message || "Erro de validação";
            }
          } catch (parseError) {
            errorMessage = rawMessage;
          }
        } else if (errorObj.message) {
          errorMessage = errorObj.message;
        }

        toast.error("Erro ao carregar movimentações", {
          description: errorMessage,
        });
      } else {
        toast.error("Erro ao carregar movimentações", {
          description:
            (movimentacoesError as Error)?.message || "Erro desconhecido",
        });
      }

      resetFilters();
    }

    if (movimentacoesData?.docs) {
      toast.info("Movimentações encontradas", {
        description: `${movimentacoesData.totalDocs} movimentações encontrada(s). Exibindo na página.`,
        duration: 2500,
      });
    }
  }, [movimentacoesError, movimentacoesIsError, movimentacoesData]);

  return (
    <div>
      <Header />

      <main className="min-h-screen p-8">
        <TypographyH2>Estoque de movimentações</TypographyH2>

        <div className="flex flex-row place-content-between pb-2 mb-2">
          <MovimentacoesFilter
            movimentacao={movimentacao}
            setMovimentacao={setMovimentacao}
            produtos={produtos}
            setProdutos={setProdutos}
            tipoProduto={tipoProduto}
            setTipoProduto={setTipoProduto}
            dataInicial={dataInicial}
            setDataInicial={setDataInicial}
            dataFinal={dataFinal}
            setDataFinal={setDataFinal}
            onSubmit={() => {
              setMovimentacaoFilter(movimentacao);
              setProdutosFilter(produtos);
              setTipoProdutoFilter(tipoProduto);
              setDataInicialFilter(dataInicial);
              setDataFinalFilter(dataFinal);
              setPage(1);
            }}
            onClear={resetFilters}
          />
          <CadastroMovimentacao
            color="green"
            size="1/8"
            open={cadastroOpen}
            onOpenChange={(value) => setCadastroOpen(value)}
          />
        </div>

        {movimentacoesIsLoading && (
          <div className="flex justify-center items-center py-20">
            <LoaderIcon role="status" className="animate-spin w-8 h-8" />
          </div>
        )}

        {movimentacoesData && !movimentacoesIsLoading && (
          <TabelaMovimentacao
            movimentacoes={movimentacoesData.docs}
            totalPages={movimentacoesData.totalPages}
            totalDocs={movimentacoesData.totalDocs}
            currentPage={movimentacoesData.page}
            perPage={movimentacoesData.limit}
            onCadastrar={() => setCadastroOpen(true)}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
