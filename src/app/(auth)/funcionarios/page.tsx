"use client";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { TypographyH2 } from "@/components/layout/subtitle";
import TabelaFuncionarios from "@/components/layout/table/funcionarioTable";
import { fetchData } from "@/services/api";
import { Funcionario } from "@/types/Funcionario";
import { AdjustDate } from "@/lib/adjustDate";
import { useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function FuncionariosPage() {
  const { data: session, status } = useSession();

  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limite, setLimite] = useQueryState(
    "limite",
    parseAsInteger.withDefault(10)
  );

  const [nomeFilter, setNomeFilter] = useQueryState(
    "nome",
    parseAsString.withDefault("")
  );
  const [cargoFilter, setCargoFilter] = useQueryState(
    "cargo",
    parseAsString.withDefault("")
  );

  const [nome, setNome] = useState(nomeFilter);
  const [cargo, setCargo] = useState(cargoFilter);
  const [cadastroOpen, setCadastroOpen] = useState<boolean>(false);

  const resetFilters = () => {
    setNome("");
    setCargo("");
    setNomeFilter("");
    setCargoFilter("");
    setPage(1);
  };

  useEffect(() => {
    setNome(nomeFilter);
    setCargo(cargoFilter);
  }, [nomeFilter, cargoFilter]);

  const {
    data: funcionariosData,
    isLoading: funcionariosIsLoading,
    isError: funcionariosIsError,
    error: funcionariosError,
  } = useQuery({
    queryKey: [
      "listaFuncionarios",
      page,
      limite,
      nomeFilter,
      cargoFilter,
      session?.user?.accesstoken,
    ],
    queryFn: async () => {
      if (process.env.NEXT_PUBLIC_SIMULAR_ERRO === "true") {
        throw new Error("Erro simulado ao carregar os dados de funcionários");
      }

      if (!session?.user?.accesstoken) {
        throw new Error("Usuário não autenticado");
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limite: limite.toString(),
        ...(nomeFilter ? { nome: nomeFilter } : {}),
        ...(cargoFilter ? { cargo: cargoFilter } : {}),
      });

      const result = await fetchData<{
        data: {
          docs: Funcionario[];
          totalDocs: number;
          totalPages: number;
          page: number;
          limit: number;
        };
      }>(
        `/usuarios?${params.toString()}`,
        "GET",
        session.user.accesstoken
      );

      if (result.data?.docs) {
        result.data.docs = result.data.docs.map((funcionario) => ({
          ...funcionario,
          data_cadastro: AdjustDate(funcionario.data_cadastro),
          data_ultima_atualizacao: AdjustDate(
            funcionario.data_ultima_atualizacao
          ),
        }));
      }

      return result.data || [];
    },
    retry: false,
    enabled: status === "authenticated" && !!session?.user?.accesstoken,
  });

  useEffect(() => {
    if (funcionariosIsError) {
      let errorMessage = "Erro desconhecido";

      if (funcionariosError && typeof funcionariosError === "object") {
        const errorObj = funcionariosError as any;
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

        toast.error("Erro ao carregar funcionários", {
          description: errorMessage,
        });
      } else {
        toast.error("Erro ao carregar funcionários", {
          description:
            (funcionariosError as Error)?.message || "Erro desconhecido",
        });
      }

      resetFilters();
    }

    if (funcionariosData?.docs) {
      toast.info("Funcionários encontrados", {
        description: `${funcionariosData.totalDocs} funcionário(s) encontrado(s). Exibindo na página.`,
        duration: 2500,
      });
    }
  }, [funcionariosError, funcionariosIsError, funcionariosData]);

  return (
    <div>
      <Header />

      <main className="min-h-screen p-8">
        <TypographyH2>Gestão de funcionários</TypographyH2>

        <div className="flex flex-row place-content-between pb-2 mb-2">
          {/* Filtros serão implementados depois */}
          <div className="flex-1"></div>
          {/* <CadastroFuncionario
            color="green"
            size="1/8"
            open={cadastroOpen}
            onOpenChange={(value) => setCadastroOpen(value)}
          /> */}
        </div>

        {funcionariosIsLoading && (
          <div className="flex justify-center items-center py-20">
            <LoaderIcon role="status" className="animate-spin w-8 h-8" />
          </div>
        )}

        {funcionariosData && !funcionariosIsLoading && (
          <TabelaFuncionarios
            funcionarios={funcionariosData.docs}
            totalPages={funcionariosData.totalPages}
            totalDocs={funcionariosData.totalDocs}
            currentPage={funcionariosData.page}
            perPage={funcionariosData.limit}
            onCadastrar={() => setCadastroOpen(true)}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}