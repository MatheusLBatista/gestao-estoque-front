"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { CustomPagination } from "../pagination/paginationWrapper";
import { ItemsPerPage } from "../pagination/itemsPerPage";
import { Fornecedor } from "@/types/Fornecedor";
import { useQueryState, parseAsInteger } from "nuqs";
import { AdjustDate } from "@/lib/adjustDate";
import FornecedorCadastro from "../popUp/fornecedores/fornecedorCadastro";
import { FornecedorListagem } from "../popUp/fornecedores/fornecedorListagem";
// import { FornecedoresFilterProps } from "../filters/fornecedoresFilter";

interface TabelaFornecedorProps {
  fornecedores: Fornecedor[];
  totalPages: number;
  totalDocs: number;
  currentPage: number;
  perPage: number;
  // filtros: FornecedoresFilterProps;
}

export default function TabelaFornecedores({
  fornecedores,
  totalPages,
  totalDocs,
  currentPage,
  perPage,
}: // filtros,
TabelaFornecedorProps) {
  const [pageState, setPageState] = useQueryState(
    "page",
    parseAsInteger.withDefault(currentPage)
  );

  const [perPageState, setPerPageState] = useQueryState(
    "limite",
    parseAsInteger.withDefault(perPage)
  );

  const [open, setOpen] = useState<boolean>(false);
  const [selectedFornecedor, setSelectedFornecedor] =
    useState<Fornecedor | null>(null);

  // TODO: review
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editForneceodr, setEditFornecedor] = useState<Fornecedor | null>(null);

  const [cadastroOpen, setCadastroOpen] = useState<boolean>(false);

  return (
    <>
      <div className="flex flex-row place-content-between pb-2">
        {/* TODO: Adicionar filtros de fornecedores */}
        <FornecedorCadastro
          color="green"
          size="1/8"
          open={cadastroOpen}
          onOpenChange={(value) => setCadastroOpen(value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left text-neutral-500">
                Nome do fornecedor
              </TableHead>
              <TableHead className="text-center text-neutral-500">
                CNPJ
              </TableHead>
              <TableHead className="text-center text-neutral-500">
                Email
              </TableHead>
              <TableHead className="text-center text-neutral-500">
                Telefone
              </TableHead>
              <TableHead className="text-center text-neutral-500">
                Data cadastro
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {fornecedores.map((fornecedor) => (
              <TableRow
                key={fornecedor._id}
                onClick={() => {
                  setSelectedFornecedor(fornecedor);
                  setOpen(true);
                }}
                className="hover:bg-slate-50 cursor-pointer"
              >
                <TableCell className="font-medium text-left text-neutral-700">
                  {fornecedor.nome_fornecedor}
                </TableCell>
                <TableCell className="text-center text-neutral-700">
                  {fornecedor.cnpj}
                </TableCell>
                <TableCell className="text-center text-neutral-700">
                  {fornecedor.email}
                </TableCell>
                <TableCell className="text-center text-neutral-700">
                  {fornecedor.telefone}
                </TableCell>
                <TableCell className="text-center text-neutral-700">
                  {AdjustDate(fornecedor.data_cadastro)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* TODO: Implementar modais de fornecedores */}
      <FornecedorListagem
        open={open}
        fornecedor={selectedFornecedor}
        onOpenChange={(value) => {
          setOpen(value);
          if (!value) setSelectedFornecedor(null);
        }}
        onEditar={(fornecedor) => {
          setOpen(false);
          setEditFornecedor(fornecedor);
          setEditOpen(true);
        }}
        onCadastrar={() => {
          setOpen(false);
          setCadastroOpen(true);
        }}
      />

      <div className="flex justify-between">
        <div className="px-4 py-6 flex items-center justify-between w-full">
          <ItemsPerPage
            perPage={perPageState ?? perPage}
            setPerPage={(value) => {
              setPerPageState(value);
              setPageState(1);
            }}
            totalItems={Number(totalDocs)}
          />

          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage ?? 1}
            onPageChange={(page) => setPageState(page)}
          />
        </div>
      </div>
    </>
  );
}
