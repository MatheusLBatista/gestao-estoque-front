import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CustomPagination } from "../pagination/paginationWrapper";
import { ItemsPerPage } from "../pagination/itemsPerPage";
import { ProdutosFilter } from "../filters/produtosFilter";
import CadastrarButton from "@/components/ui/cadastrarButton";
import { CadastroProduto } from "../popUp/produtoCadastro";
import { Printer, PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface Produto {
  _id: string;
  nome_produto: string;
  codigo_produto: string;
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
  const [open, setOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);

  return (
    <>
      <div className="flex flex-row place-content-between pb-2">
        <ProdutosFilter />
        <CadastroProduto />
      </div>

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
                Código
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
              <TableRow
                key={produto._id}
                onClick={() => {
                  setSelectedProduct(produto);
                  setOpen(true);
                }}
                className="hover:bg-slate-50"
              >
                <TableCell className="cursor-pointer font-medium text-center text-neutral-700">
                  {produto.nome_produto}
                </TableCell>
                <TableCell className="cursor-pointer text-center text-neutral-700">
                  {produto.categoria}
                </TableCell>
                <TableCell className="cursor-pointer text-center text-neutral-700">
                  {produto.codigo_produto}
                </TableCell>
                <TableCell className="cursor-pointer text-center text-neutral-700">
                  {produto.estoque}
                </TableCell>
                <TableCell className="cursor-pointer text-center text-neutral-700">
                  R$ {produto.custo.toFixed(2)}
                </TableCell>
                <TableCell
                  className="cursor-pointer max-w-xs truncate text-neutral-700"
                  title={produto.descricao}
                >
                  {produto.descricao}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
        <DialogContent className="max-w-lg gap-6">
          <DialogHeader className="flex flex-col gap-2 py-2 border-b">
            <DialogTitle>Detalhes do produto</DialogTitle>
            <DialogDescription>
              Informações detalhadas do produto selecionado.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-sm text-neutral-700">
            {selectedProduct ? (
              <>
                <div className="flex justify-between">
                  {/* <div className="text-xs text-neutral-400">
                    ID: {selectedProduct._id}
                  </div> */}
                  <div>
                    <strong className="text-neutral-900">Nome:</strong>{" "}
                    {selectedProduct.nome_produto}
                  </div>
                  
                  <div>
                    <strong className="text-neutral-900">Código:</strong>{" "}
                    {selectedProduct.codigo_produto}
                  </div>
                </div>

                <div className="flex justify-between">
                  <div>
                    <strong className="text-neutral-900">Marca:</strong>{" "}
                    {selectedProduct.marca}
                  </div>
                  <div>
                    <strong className="text-neutral-900">Categoria:</strong>{" "}
                    {selectedProduct.categoria}
                  </div>
                </div>

                <div className="flex justify-between">
                  <div>
                    <strong className="text-neutral-900">Estoque:</strong>{" "}
                    {selectedProduct.estoque}
                  </div>
                  <div>
                    <strong className="text-neutral-900">Custo:</strong> R${" "}
                    {selectedProduct.custo.toFixed(2)}
                  </div>
                </div>

                <div>
                  <strong className="text-neutral-900">Descrição:</strong>
                  <p className="whitespace-pre-wrap text-neutral-700 mt-1">
                    {selectedProduct.descricao || "Sem descrição."}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-neutral-500">
                Nenhum produto selecionado.
              </div>
            )}
          </div>

          <div className="flex flex-row justify-between pt-4 border-t">
            <div className="flex gap-2">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                onClick={() => console.log("Imprimir produto")}
              >
                <Printer className="w-4 h-4" /> Imprimir
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                onClick={() => console.log("Novo produto")}
              >
                <PackagePlus className="w-4 h-4" /> Novo Produto
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex justify-between">
        <div className="px-4 py-6 flex items-center">
          <ItemsPerPage
            perPage={perPage}
            setPerPage={setPerPage}
            totalItems={Number(produtos.length)}
          />
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
