"use client";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { TypographyH2 } from "@/components/layout/subtitle";
import { Fornecedor } from "@/types/Fornecedor";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/services/api";
import { LoaderIcon } from "lucide-react";
import { toast } from "sonner";
import { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  useQueryState,
  parseAsInteger,
  parseAsString,
} from "nuqs";
import TabelaFornecedores from "@/components/layout/table/fornecedoresTable";
import { FornecedoresFilter } from "@/components/layout/filters/fornecedoresFilter";
import FornecedorCadastro from "@/components/layout/popUp/fornecedores/fornecedorCadastro";

export default function FornecedoresPage() {
  const { data: session, status } = useSession();

  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limite, setLimite] = useQueryState(
    "limite",
    parseAsInteger.withDefault(10)
  );

  const [nomeFornecedorFilter, setNome_fornecedorFilter] = useQueryState(
    "nome_fornecedor",
    parseAsString.withDefault("")
  );

  const [ativoFilter, setAtivoFilter] = useQueryState(
    "status",
    parseAsString.withDefault("true")
  );

  const [nomeFornecedor, setNomeFornecedor] = useState(nomeFornecedorFilter);
  const [ativo, setAtivo] = useState<boolean | null>(
    ativoFilter === "todos" ? null : ativoFilter === "true"
  );
  const [cadastroOpen, setCadastroOpen] = useState<boolean>(false);

  const resetFilters = () => {
    setNomeFornecedor("");
    setAtivo(null);
    setNome_fornecedorFilter("");
    setAtivoFilter("todos");
    setPage(1);
  };

  useEffect(() => {
    setNomeFornecedor(nomeFornecedorFilter);
    setAtivo(ativoFilter === "todos" ? null : ativoFilter === "true");
  }, [nomeFornecedorFilter, ativoFilter]);

  const {
    data: fornecedoresData,
    isLoading: fornecedoresIsLoading,
    isError: fornecedoresIsError,
    error: fornecedoresError,
  } = useQuery({
    queryKey: [
      "listaFornecedores",
      page,
      limite,
      nomeFornecedorFilter,
      ativoFilter,
      session?.user?.accesstoken,
    ],
    queryFn: async () => {
      if (process.env.NEXT_PUBLIC_SIMULAR_ERRO === "true") {
        throw new Error("Erro simulado ao carregar dados de fornecedores");
      }

      if (!session?.user?.accesstoken) {
        throw new Error("Usuário não autenticado");
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limite: limite.toString(),
        ...(nomeFornecedorFilter && { nome_fornecedor: nomeFornecedorFilter }),
        ...(ativoFilter === "true" ? { status: "true" } : {}),
        ...(ativoFilter === "false" ? { status: "false" } : {}),
      });

      const result = await fetchData<{
        data: {
          docs: Fornecedor[];
          totalDocs: number;
          totalPages: number;
          page: number;
          limit: number;
        };
      }>(`/fornecedores?${params.toString()}`, "GET", session.user.accesstoken);

      return result.data || [];
    },
    retry: false,
    enabled: status === "authenticated" && !!session?.user?.accesstoken,
  });

  useEffect(() => {
    if (fornecedoresIsError) {
      toast.error("Erro ao carregar fornecedores", {
        description:
          (fornecedoresError as Error)?.message || "Erro desconhecido",
      });

      resetFilters();
    }

    if (fornecedoresData?.totalDocs) {
      toast.info("Fornecedores encontrados", {
        description: `${fornecedoresData.totalDocs} fornecedor(es) encontrado(s). Exibindo na página.`,
        duration: 2500,
      });
    }
  }, [fornecedoresIsError, fornecedoresError, fornecedoresData]);

  return (
    <div>
      <Header />

      <main className="min-h-screen p-8">
        <TypographyH2>Gestão de Fornecedores</TypographyH2>

        <div className="flex flex-row place-content-between pb-2 mb-4">
          <FornecedoresFilter
            nomeFornecedor={nomeFornecedor}
            setNomeFornecedor={setNomeFornecedor}
            ativo={ativo}
            setAtivo={setAtivo}
            onSubmit={() => {
              setPage(1);
              setNome_fornecedorFilter(nomeFornecedor);
              setAtivoFilter(
                ativo === null ? "todos" : ativo === true ? "true" : "false"
              );
            }}
            onClear={resetFilters}
            onStatusChange={(newStatus) => {
              setAtivo(newStatus);
              setPage(1);
              setAtivoFilter(
                newStatus === null
                  ? "todos"
                  : newStatus === true
                  ? "true"
                  : "false"
              );
            }}
          />
          <FornecedorCadastro
            color="green"
            size="1/8"
            open={cadastroOpen}
            onOpenChange={(value) => setCadastroOpen(value)}
          />
        </div>

        {fornecedoresIsLoading && (
          <div className="flex justify-center items-center py-20">
            <LoaderIcon role="status" className="animate-spin w-8 h-8" />
          </div>
        )}

        {fornecedoresData && !fornecedoresIsLoading && (
          <TabelaFornecedores
            fornecedores={fornecedoresData.docs}
            totalPages={fornecedoresData.totalPages}
            totalDocs={fornecedoresData.totalDocs}
            currentPage={fornecedoresData.page}
            perPage={fornecedoresData.limit}
            onCadastrar={() => setCadastroOpen(true)}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
