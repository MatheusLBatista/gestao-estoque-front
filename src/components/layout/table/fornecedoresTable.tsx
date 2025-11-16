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
import { FornecedorListagem } from "../popUp/fornecedores/fornecedorListagem";
import { FornecedorEdicao } from "../popUp/fornecedores/fornecedorEdicao";

interface TabelaFornecedorProps {
  fornecedores: Fornecedor[];
  totalPages: number;
  totalDocs: number;
  currentPage: number;
  perPage: number;
  onCadastrar?: () => void;
}

export default function TabelaFornecedores({
  fornecedores,
  totalPages,
  totalDocs,
  currentPage,
  perPage,
  onCadastrar,
}: TabelaFornecedorProps) {
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

  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editFornecedor, setEditFornecedor] = useState<Fornecedor | null>(null);

  return (
    <>
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
          onCadastrar?.();
        }}
        onExcluir={(fornecedor) => {
          setOpen(false);
          setSelectedFornecedor(null);
        }}
      />

      <FornecedorEdicao
        open={editOpen}
        onOpenChange={(value) => {
          setEditOpen(value);
          if (!value) setEditFornecedor(null);
        }}
        fornecedor={editFornecedor}
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
            tableData={fornecedores}
            tableTitle="Relatório de Fornecedores"
            tableColumns={[
              { key: "nome_fornecedor", label: "Nome do Fornecedor" },
              { key: "cnpj", label: "CNPJ" },
              { key: "telefone", label: "Telefone" },
              { key: "email", label: "Email" },
              {
                key: "status",
                label: "Status",
                format: (value) => (value ? "Ativo" : "Inativo"),
              },
              {
                key: "endereco",
                label: "Cidade/UF",
                format: (value) => {
                  const endereco = value?.[0];
                  return endereco
                    ? `${endereco.cidade}/${endereco.estado}`
                    : "-";
                },
              },
              {
                key: "data_cadastro",
                label: "Data de cadastro",
                format: (value) => (value ? AdjustDate(value) : "-"),
              },
            ]}
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
