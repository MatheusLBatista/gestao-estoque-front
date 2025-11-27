"use client";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { TypographyH2 } from "@/components/layout/subtitle";
import TabelaFuncionarios from "@/components/layout/table/funcionarioTable";
import { FuncionariosFilter } from "@/components/layout/filters/funcionariosFilter";
import { fetchData } from "@/services/api";
import { Funcionario } from "@/types/Funcionario";
import { AdjustDate } from "@/lib/adjustDate";
import { useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { CadastroFuncionario } from "@/components/layout/popUp/funcionarios/funcionarioCadastro";
import { canModifyFuncionarios } from "@/lib/permissions";

export default function FuncionariosPage() {
  const { data: session, status: sessionStatus } = useSession();
  const canModify = canModifyFuncionarios(session?.user?.perfil);

  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limite, setLimite] = useQueryState(
    "limite",
    parseAsInteger.withDefault(10)
  );

  const [usuarioFilter, setUsuarioFilter] = useQueryState(
    "usuario",
    parseAsString.withDefault("")
  );
  const [perfilFilter, setPerfilFilter] = useQueryState(
    "perfil",
    parseAsString.withDefault("")
  );
  const [statusFilter, setStatusFilter] = useQueryState(
    "status",
    parseAsString.withDefault("ativo")
  );

  const [usuario, setUsuario] = useState(usuarioFilter);
  const [perfil, setPerfil] = useState(perfilFilter);
  const [status, setStatus] = useState(statusFilter);
  const [cadastroOpen, setCadastroOpen] = useState<boolean>(false);

  const resetFilters = () => {
    setUsuario("");
    setPerfil("");
    setStatus("");
    setUsuarioFilter("");
    setPerfilFilter("");
    setStatusFilter("");
    setPage(1);
  };

  useEffect(() => {
    setUsuario(usuarioFilter);
    setPerfil(perfilFilter);
    setStatus(statusFilter);
  }, [usuarioFilter, perfilFilter, statusFilter]);

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
      usuarioFilter,
      perfilFilter,
      statusFilter,
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
        ...(usuarioFilter ? { usuario: usuarioFilter } : {}),
        ...(perfilFilter ? { perfil: perfilFilter } : {}),
        ...(statusFilter === "ativo" ? { ativo: "true" } : {}),
        ...(statusFilter === "inativo" ? { ativo: "false" } : {}),
      });

      const result = await fetchData<{
        data: {
          docs: Funcionario[];
          totalDocs: number;
          totalPages: number;
          page: number;
          limit: number;
        };
      }>(`/usuarios?${params.toString()}`, "GET", session.user.accesstoken);

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
    enabled: sessionStatus === "authenticated" && !!session?.user?.accesstoken,
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
          <FuncionariosFilter
            usuario={usuarioFilter}
            setUsuario={(value) => {
              setUsuarioFilter(value);
              setPage(1);
            }}
            perfil={perfilFilter}
            setPerfil={(value) => {
              setPerfilFilter(value);
              setPage(1);
            }}
            status={statusFilter}
            setStatus={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
            onSubmit={() => {
              // A busca será disparada automaticamente pela mudança nos query states
            }}
            onClear={() => resetFilters()}
          />
          <div className="flex-1"></div>
          {canModify && (
            <CadastroFuncionario
              color="green"
              size="1/8"
              open={cadastroOpen}
              onOpenChange={(value) => setCadastroOpen(value)}
            />
          )}
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
