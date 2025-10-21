"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdjustDate } from "@/lib/adjustDate";
import { AdjustPrice } from "@/lib/adjustPrice";
import { Movimentacao } from "@/types/Movimentacao";
import { parseAsInteger, useQueryState } from "nuqs";
import { useState } from "react";
import { ItemsPerPage } from "../pagination/itemsPerPage";
import { CustomPagination } from "../pagination/paginationWrapper";

interface TabelaMovimentacaoProps {
  movimentacoes: Movimentacao[];
  totalPages: number;
  totalDocs: number;
  currentPage: number;
  perPage: number;
}

export default function TabelaMovimentacao({
  movimentacoes,
  totalPages,
  totalDocs,
  currentPage,
  perPage,
}: TabelaMovimentacaoProps) {
  if (!movimentacoes || movimentacoes.length === 0) return null;

  const [pageState, setPageState] = useQueryState(
    "page",
    parseAsInteger.withDefault(currentPage)
  );

  const [perPageState, setPerPageState] = useQueryState(
    "limite",
    parseAsInteger.withDefault(perPage)
  );

  const [open, setOpen] = useState<boolean>(false);
  const [selectedMovimentacao, setSelectedMovimentacao] =
    useState<Movimentacao | null>(null);

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center text-neutral-500">ID</TableHead>
              <TableHead className="text-center text-neutral-500">
                Tipo
              </TableHead>
              <TableHead className="text-center text-neutral-500">
                Produto
              </TableHead>
              <TableHead className="text-center text-neutral-500">
                Destino
              </TableHead>
              <TableHead className="text-center text-neutral-500">
                Custo
              </TableHead>
              <TableHead className="text-center text-neutral-500">
                Quantidade
              </TableHead>
              <TableHead className="text-center text-neutral-500">
                Data
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {movimentacoes.map((m) => (
              <TableRow
                key={m._id}
                onClick={() => {
                  setSelectedMovimentacao(m);
                  setOpen(true);
                }}
                className="hover:bg-slate-50 cursor-pointer"
              >
                <TableCell className="text-center text-sm text-neutral-700">
                  {m._id}
                </TableCell>

                <TableCell className="text-center text-sm text-neutral-700 uppercase">
                  {m.tipo}
                </TableCell>

                <TableCell className="text-center text-sm text-neutral-700">
                  {"-"}
                </TableCell>

                <TableCell className="text-center text-sm text-neutral-700">
                  {m.destino || "-"}
                </TableCell>

                <TableCell className="text-center text-sm text-neutral-700">
                  {AdjustPrice(0)}
                </TableCell>

                <TableCell className="text-center text-sm text-neutral-700">
                  {0}
                </TableCell>

                <TableCell className="text-center text-sm text-neutral-700">
                  {AdjustDate(m.data_cadastro)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
