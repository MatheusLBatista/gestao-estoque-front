"use client";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { TypographyH2 } from "@/components/layout/subtitle";
import { Fornecedor } from "@/types/Fornecedor";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/services/api";
import { LoaderIcon } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useQueryState, parseAsInteger, parseAsString, parseAsBoolean } from "nuqs";
import TabelaFornecedores from "@/components/layout/table/fornecedoresTable";

export default function FornecedoresPage() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limite, setLimite] = useQueryState(
    "limite",
    parseAsInteger.withDefault(10)
  );

  const [nomeFornecedorFilter, setNome_fornecedorFilter] = useQueryState(
    "nome_fornecedor",
    parseAsString.withDefault("")
  );

  const [cnpjFilter, setCnpjFilter] = useQueryState(
    "cnpj",
    parseAsString.withDefault("")
  );

  const [emailFilter, setEmailFilter] = useQueryState(
    "email",
    parseAsString.withDefault("")
  );

  const [ativoFilter, setAtivoFilter] = useQueryState(
    "status",
    parseAsBoolean.withDefault(true)
  );

  const[nomeFornecedor, setNomeFornecedor] = useState(nomeFornecedorFilter);
  const[cnpj, setCnpj] = useState(cnpjFilter);
  const[email, setEmail] = useState(emailFilter);
  const[ativo, setAtivo] = useState<boolean | null>(ativoFilter ?? true)

  useEffect(() => {
    setNomeFornecedor(nomeFornecedorFilter)
    setCnpj(cnpjFilter)
    setEmail(emailFilter)
  }, [nomeFornecedorFilter, cnpjFilter, emailFilter])

  const {
    data: fornecedoresData,
    isLoading: fornecedoresIsLoading,
    isError: fornecedoresIsError,
    error: fornecedoresError,
  } = useQuery({
    queryKey: ["listaFornecedores", page, limite, nomeFornecedorFilter, cnpjFilter, emailFilter, ativoFilter],
    queryFn: async () => {
      if (process.env.NEXT_PUBLIC_SIMULAR_ERRO === "true") {
        throw new Error("Erro simulado ao carregar dados de fornecedores");
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limite: limite.toString(),
        ...(nomeFornecedorFilter && ({ nome_fornecedor: nomeFornecedorFilter })),
        ...(cnpjFilter && ({ cnpj: cnpjFilter })),
        ...(emailFilter && ({ email: emailFilter })),
        ...(ativoFilter === true ? { status: "true" } : {}),
        ...(ativoFilter === false ? { status: "false" } : {}),
      });

      const result = await fetchData<{
        data: {
          docs: Fornecedor[];
          totalDocs: number;
          totalPages: number;
          page: number;
          limit: number;
        };
      }>(`/fornecedores?${params.toString()}`, "GET");

      return result.data || [];
    },
    retry: false,
  });

  useEffect(() => {
    if (fornecedoresIsError) {
      toast.error("Erro ao carregar fornecedores", {
        description:
          (fornecedoresError as Error)?.message || "Erro desconhecido",
      });
    }

    if (fornecedoresData?.totalDocs) {
      toast.info("Fornecedores encontrados", {
        description: `${fornecedoresData.totalDocs} fornecedor(es) encontrado(s). Exibindo na página.`,
        duration: 2500,
      });
    }
  }, [
    fornecedoresIsError,
    fornecedoresError,
    fornecedoresData,
    limite,
    setLimite,
    setPage,
  ]);

  return (
    <div>
      <Header />

      <main className="min-h-screen p-8">
        <TypographyH2>Gestão de Fornecedores</TypographyH2>

        {fornecedoresIsLoading && (
          <LoaderIcon role="status" className="animate-spin mt-20 mx-auto" />
        )}

        {fornecedoresData && (
          <TabelaFornecedores
            fornecedores={fornecedoresData.docs}
            totalPages={fornecedoresData.totalPages}
            totalDocs={fornecedoresData.totalDocs}
            currentPage={fornecedoresData.page}
            perPage={fornecedoresData.limit}
            filtros={{
              nomeFornecedor,
              cnpj,
              email,
              ativo,
              setNomeFornecedor,
              setCnpj,
              setEmail,
              setAtivo,
              onSubmit: () => {
                setPage(1);
                setNome_fornecedorFilter(nomeFornecedor);
                setCnpjFilter(cnpj);
                setEmailFilter(email);
                setAtivoFilter(ativo);
              },
            }}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}