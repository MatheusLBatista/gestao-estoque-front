"use client";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { TypographyH2 } from "@/components/layout/subtitle";
import TabelaProdutos from "@/components/layout/table/produtoTable";
import { Produto } from "../../types/Produto";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/services/api";
import { LoaderIcon } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import {
  useQueryState,
  parseAsInteger,
  parseAsString,
  parseAsBoolean,
} from "nuqs";

export default function ProdutosPage() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limite, setLimite] = useQueryState(
    "limite",
    parseAsInteger.withDefault(20)
  );
  const [nomeProduto, setNomeProduto] = useQueryState(
    "nome_produto",
    parseAsString.withDefault("")
  );
  const [categoria, setCategoria] = useQueryState(
    "categoria",
    parseAsString.withDefault("")
  );
  const [codigoProduto, setCodigoProduto] = useQueryState(
    "codigo_produto",
    parseAsString.withDefault("")
  );
  const [estoqueBaixo, setEstoqueBaixo] = useQueryState(
    "estoque_baixo",
    parseAsBoolean.withDefault(false)
  );

  const {
    data: produtosData,
    isLoading: produtosIsLoading,
    isError: produtosIsError,
    error: produtosError,
  } = useQuery({
    queryKey: [
      "listaProdutos",
      page,
      limite,
      nomeProduto,
      codigoProduto,
      categoria,
      estoqueBaixo,
    ],
    queryFn: async () => {
      if (process.env.NEXT_PUBLIC_SIMULAR_ERRO === "true") {
        throw new Error("Erro simulado ao carregar dados de produtos");
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limite: limite.toString(),
        ...(nomeProduto && { nome_produto: nomeProduto }),
        ...(codigoProduto && { codigo_produto: codigoProduto }),
        ...(categoria && { categoria: categoria }),
        ...(estoqueBaixo && { estoque_baixo: "true" }),
      });

      const result = await fetchData<{
        data: {
          docs: Produto[];
          totalDocs: number;
          totalPages: number;
          page: number;
          limit: number;
        };
      }>(`/produtos?${params.toString()}`, "GET");

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
    
    if (produtosData?.totalDocs) {
        toast.info("Produtos encontrados", {
          description: `${produtosData.totalDocs} produto(s) encontrado(s). Exibindo na página.`,
          duration: 2500,
        });
      }
  }, [produtosIsError, produtosError, produtosData, limite, setLimite, setPage]);

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
            filtros={{
              nomeProduto,
              codigoProduto,
              categoria,
              estoqueBaixo,
              setNomeProduto,
              setCodigoProduto,
              setCategoria,
              setEstoqueBaixo,
              onSubmit: () => setPage(1),
            }}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
