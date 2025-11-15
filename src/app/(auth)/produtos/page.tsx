"use client";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { TypographyH2 } from "@/components/layout/subtitle";
import TabelaProdutos from "@/components/layout/table/produtoTable";
import { Produto } from "@/types/Produto";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/services/api";
import { LoaderIcon } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  useQueryState,
  parseAsInteger,
  parseAsString,
  parseAsBoolean,
} from "nuqs";
import { ProdutosFilter } from "@/components/layout/filters/produtosFilter";
import { CadastroProduto } from "@/components/layout/popUp/produto/produtoCadastro";

export default function ProdutosPage() {
  const { data: session, status } = useSession();

  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limite, setLimite] = useQueryState(
    "limite",
    parseAsInteger.withDefault(10)
  );

  const [produtoFilter, setProdutoFilter] = useQueryState(
    "produto",
    parseAsString.withDefault("")
  );
  const [categoriaFilter, setCategoriaFilter] = useQueryState(
    "categoria",
    parseAsString.withDefault("")
  );
  const [estoqueBaixoFilter, setEstoqueBaixoFilter] = useQueryState(
    "estoque_baixo",
    parseAsBoolean.withDefault(false)
  );

  const [categoria, setCategoria] = useState("");
  const [produto, setProduto] = useState("");
  const [estoqueBaixo, setEstoqueBaixo] = useState(false);
  const [cadastroOpen, setCadastroOpen] = useState<boolean>(false);

  const resetFilters = () => {
    setProdutoFilter("");
    setCategoriaFilter("");
    setEstoqueBaixoFilter(false);
    setPage(1);

    setProduto("");
    setCategoria("");
    setEstoqueBaixo(false);
  };

  useEffect(() => {
    setProduto(produtoFilter);
    setCategoria(categoriaFilter);
    setEstoqueBaixo(estoqueBaixoFilter);
  }, [produtoFilter, categoriaFilter, estoqueBaixoFilter]);

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
      produtoFilter,
      categoriaFilter,
      estoqueBaixoFilter,
      session?.user?.accesstoken,
    ],
    queryFn: async () => {
      if (process.env.NEXT_PUBLIC_SIMULAR_ERRO === "true") {
        throw new Error("Erro simulado ao carregar dados de produtos");
      }

      if (!session?.user?.accesstoken) {
        throw new Error("Usuário não autenticado");
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limite: limite.toString(),
        ...(produtoFilter && { produto: produtoFilter }),
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
      }>(`/produtos?${params.toString()}`, "GET", session.user.accesstoken);

      return result.data || [];
    },
    retry: false,
    enabled: status === "authenticated" && !!session?.user?.accesstoken,
  });

  useEffect(() => {
    if (produtosIsError) {
      setTimeout(() => {
        resetFilters(), 50;
      });

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
  }, [produtosIsError, produtosError, produtosData]);

  return (
    <div>
      <Header />

      <main className="min-h-screen p-8">
        <TypographyH2>Estoque de produtos</TypographyH2>

        <div className="flex flex-row place-content-between pb-2 mb-2">
          <ProdutosFilter
            produto={produto}
            setProduto={setProduto}
            categoria={categoria}
            setCategoria={setCategoria}
            estoqueBaixo={estoqueBaixo}
            setEstoqueBaixo={setEstoqueBaixo}
            onSubmit={() => {
              setProdutoFilter(produto);
              setCategoriaFilter(categoria);
              setEstoqueBaixoFilter(estoqueBaixo);
              setPage(1);
            }}
            onClear={resetFilters}
          />
          <CadastroProduto
            color="green"
            size="1/8"
            open={cadastroOpen}
            onOpenChange={(value) => setCadastroOpen(value)}
          />
        </div>

        {produtosIsLoading && (
          <div className="flex justify-center items-center py-20">
            <LoaderIcon role="status" className="animate-spin mt-20 mx-auto" />
          </div>
        )}

        {produtosData && !produtosIsLoading && (
          <TabelaProdutos
            produtos={produtosData.docs}
            totalPages={produtosData.totalPages}
            totalDocs={produtosData.totalDocs}
            currentPage={produtosData.page}
            perPage={produtosData.limit}
            onCadastrar={() => setCadastroOpen(true)}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
