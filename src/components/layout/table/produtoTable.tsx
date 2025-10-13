import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Printer } from "lucide-react";
import { CustomPagination } from "../pagination";

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
          <p className="text-xs text-neutral-500 flex items-center gap-2">
            <span>Exibindo</span>
            {
              <Select
                value={String(perPage)}
                onValueChange={(v) => setPerPage(Number(v))}
              >
                <SelectTrigger className="w-[73px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Array.from({ length: 100 }, (_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            }
            <span>de {produtos.length}</span>
          </p>
          <div className="flex px-3">
            <Printer className="w-4 h-4 text-neutral-400 cursor-pointer hover:text-neutral-600" />
          </div>
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
