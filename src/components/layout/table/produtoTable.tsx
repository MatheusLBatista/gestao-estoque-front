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

export interface Produto {
  _id: string;
  nome_produto: string;
  descricao: string;
  marca: string;
  custo: number;
  categoria: string;
  estoque: number;
  estoque_min: number;
  data_ultima_entrada: string;
}

interface TabelaProdutosProps {
  produtos: Produto[];
}

export default function TabelaProdutos({ produtos }: TabelaProdutosProps) {
  if (!produtos.length) return null;

  const [perPage, setPerPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(produtos.length / perPage)
  );
  const [currentPage, setCurrentPage] = useState<number>(1);

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center text-neutral-500">
                Nome do Produto
              </TableHead>
              <TableHead className="text-center text-neutral-500">
                Categoria
              </TableHead>
              <TableHead className="text-center text-neutral-500">
                Marca
              </TableHead>
              <TableHead className="text-center text-neutral-500">
                Estoque
              </TableHead>
              <TableHead className="text-center text-neutral-500">
                Custo
              </TableHead>
              <TableHead className="text-center text-neutral-500">
                Descrição
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {produtos.map((produto) => (
              <TableRow key={produto._id}>
                <TableCell className="font-medium text-center text-neutral-700">
                  {produto.nome_produto}
                </TableCell>
                <TableCell className="text-center text-neutral-700">
                  {produto.categoria}
                </TableCell>
                <TableCell className="text-center text-neutral-700">
                  {produto.marca}
                </TableCell>
                <TableCell className="text-center text-neutral-700">
                  {produto.estoque}
                </TableCell>
                <TableCell className="text-center text-neutral-700">
                  R$ {produto.custo.toFixed(2)}
                </TableCell>
                <TableCell
                  className="max-w-xs truncate text-neutral-700"
                  title={produto.descricao}
                >
                  {produto.descricao}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between">
        <div className="px-4 py-6 flex items-center">
          <ItemsPerPage 
            perPage={perPage}
            setPerPage={setPerPage}
            totalItems={Number(produtos.length)} />
        </div>

        <CustomPagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}
