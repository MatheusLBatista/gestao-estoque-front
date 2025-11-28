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
import { Funcionario } from "@/types/Funcionario";
import { useQueryState, parseAsInteger } from "nuqs";
import { AdjustDate } from "@/lib/adjustDate";
import { FuncionarioListagem } from "../popUp/funcionarios/funcionarioListagem";
import { FuncionarioEdicao } from "../popUp/funcionarios/funcionarioEdicao";
import { capitalizeFirst } from "@/lib/capitalize";

interface TabelaFuncionariosProps {
  funcionarios: Funcionario[];
  totalPages: number;
  totalDocs: number;
  currentPage: number;
  perPage: number;
  onCadastrar?: () => void;
}

export default function TabelaFuncionarios({
  funcionarios,
  totalPages,
  totalDocs,
  currentPage,
  perPage,
  onCadastrar,
}: TabelaFuncionariosProps) {
  const [pageState, setPageState] = useQueryState(
    "page",
    parseAsInteger.withDefault(currentPage)
  );

  const [perPageState, setPerPageState] = useQueryState(
    "limite",
    parseAsInteger.withDefault(perPage)
  );

  const [open, setOpen] = useState<boolean>(false);
  const [selectedFuncionario, setSelectedFuncionario] =
    useState<Funcionario | null>(null);

  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editFuncionario, setEditFuncionario] = useState<Funcionario | null>(null);

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left text-neutral-500">
                Nome do funcionário
              </TableHead>
              <TableHead className="text-center text-neutral-500">
                Matrícula
              </TableHead>
              <TableHead className="text-left text-neutral-500">
                Email
              </TableHead>
              <TableHead className="text-center text-neutral-500">
                Telefone
              </TableHead>
              <TableHead className="text-center text-neutral-500">
                Perfil
              </TableHead>
              <TableHead className="text-center text-neutral-500">
                Data cadastro
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {funcionarios.map((funcionario) => (
              <TableRow
                key={funcionario._id}
                onClick={() => {
                  setSelectedFuncionario(funcionario);
                  setOpen(true);
                }}
                className="hover:bg-slate-50 cursor-pointer"
              >
                <TableCell className="font-medium text-left text-neutral-700">
                  {funcionario.nome_usuario}
                </TableCell>
                <TableCell className="text-center text-neutral-700">
                  {funcionario.matricula}
                </TableCell>
                <TableCell className="text-left text-neutral-700">
                  {funcionario.email}
                </TableCell>
                <TableCell className="text-center text-neutral-700">
                  {funcionario.telefone}
                </TableCell>
                <TableCell className="text-center text-neutral-700">
                  {capitalizeFirst(funcionario.perfil)}
                </TableCell>
                <TableCell className="text-center text-neutral-700">
                  {AdjustDate(funcionario.data_cadastro)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <FuncionarioListagem
        open={open}
        funcionario={selectedFuncionario}
        onOpenChange={(value) => {
          setOpen(value);
          if (!value) setSelectedFuncionario(null);
        }}
        onEditar={(funcionario) => {
          setOpen(false);
          setEditFuncionario(funcionario);
          setEditOpen(true);
        }}
        onCadastrar={() => {
          setOpen(false);
          onCadastrar?.();
        }}
        onExcluir={(funcionario) => {
          setOpen(false);
          setSelectedFuncionario(null);
        }}
      />

      <FuncionarioEdicao
        open={editOpen}
        onOpenChange={(value) => {
          setEditOpen(value);
          if (!value) setEditFuncionario(null);
        }}
        funcionario={editFuncionario}
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
            tableData={funcionarios}
            tableTitle="Relatório de Funcionários"
            tableColumns={[
              { key: "nome_usuario", label: "Nome do Funcionário" },
              { key: "matricula", label: "Matrícula" },
              { key: "email", label: "Email" },
              { key: "perfil", label: "Perfil" },
              { key: "telefone", label: "Telefone" },
              {
                key: "ativo",
                label: "Status",
                format: (value) => (value ? "Ativo" : "Inativo"),
              },
              {
                key: "data_cadastro",
                label: "Data de cadastro",
                format: (value) => (value ? AdjustDate(value) : "-"),
              },
              {
                key: "data_ultima_atualizacao",
                label: "Data de última atualização",
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
