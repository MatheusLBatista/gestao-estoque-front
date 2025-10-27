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
import { useEffect, useState } from "react";
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
    parseAsInteger.withDefault(10)
  );

  const [nomeProdutoFilter, setNomeProdutoFilter] = useQueryState(
    "nome_produto",
    parseAsString.withDefault("")
  );
  const [categoriaFilter, setCategoriaFilter] = useQueryState(
    "categoria",
    parseAsString.withDefault("")
  );
  const [codigoProdutoFilter, setCodigoProdutoFilter] = useQueryState(
    "codigo_produto",
    parseAsString.withDefault("")
  );
  const [estoqueBaixoFilter, setEstoqueBaixoFilter] = useQueryState(
    "estoque_baixo",
    parseAsBoolean.withDefault(false)
  );

  const [nomeProduto, setNomeProduto] = useState(nomeProdutoFilter);
  const [categoria, setCategoria] = useState(categoriaFilter);
  const [codigoProduto, setCodigoProduto] = useState(codigoProdutoFilter);
  const [estoqueBaixo, setEstoqueBaixo] = useState(estoqueBaixoFilter);

  useEffect(() => {
    setNomeProduto(nomeProdutoFilter);
    setCategoria(categoriaFilter);
    setCodigoProduto(codigoProdutoFilter);
    setEstoqueBaixo(estoqueBaixoFilter);
  }, [
    nomeProdutoFilter,
    categoriaFilter,
    codigoProdutoFilter,
    estoqueBaixoFilter,
  ]);

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
      nomeProdutoFilter,
      codigoProdutoFilter,
      categoriaFilter,
      estoqueBaixoFilter,
    ],
    queryFn: async () => {
      if (process.env.NEXT_PUBLIC_SIMULAR_ERRO === "true") {
        throw new Error("Erro simulado ao carregar dados de produtos");
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limite: limite.toString(),
        ...(nomeProdutoFilter && { nome_produto: nomeProdutoFilter }),
        ...(codigoProdutoFilter && { codigo_produto: codigoProdutoFilter }),
        ...(categoriaFilter && { categoria: categoriaFilter }),
        ...(estoqueBaixoFilter && { estoque_baixo: "true" }),
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
  }, [
    produtosIsError,
    produtosError,
    produtosData,
    limite,
    setLimite,
    setPage,
  ]);

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
              onSubmit: () => {
                // Aplicar os filtros locais na URL e resetar para a página 1
                setNomeProdutoFilter(nomeProduto);
                setCodigoProdutoFilter(codigoProduto);
                setCategoriaFilter(categoria);
                setEstoqueBaixoFilter(estoqueBaixo);
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
