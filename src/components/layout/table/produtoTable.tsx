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
import { ProdutosFilter } from "../filters/produtosFilter";
import { CadastroProduto } from "../popUp/produto/produtoCadastro";
import { ProdutoEdicao } from "../popUp/produto/produtoEdicao";
import { Produto } from "../../../lib/Produto";
import { ProdutoListagem } from "../popUp/produto/produtoListagem";
import { AdjustPrice } from "@/lib/adjustPrice";
import { useQueryState, parseAsInteger } from "nuqs";
import { ProdutosFilterProps } from "../filters/produtosFilter";

interface TabelaProdutosProps {
  produtos: Produto[];
  totalPages: number;
  totalDocs: number;
  currentPage: number;
  perPage: number;
  filtros: ProdutosFilterProps;
}

export default function TabelaProdutos({
  produtos,
  totalPages,
  totalDocs,
  currentPage,
  perPage,
  filtros,
}: TabelaProdutosProps) {
  if (!produtos.length) return null;

  const [pageState, setPageState] = useQueryState(
    "page",
    parseAsInteger.withDefault(currentPage)
  );

  const [perPageState, setPerPageState] = useQueryState(
    "limite",
    parseAsInteger.withDefault(perPage)
  );

  const [open, setOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);

  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editProduct, setEditProduct] = useState<Produto | null>(null);

  const [cadastroOpen, setCadastroOpen] = useState<boolean>(false);

  return (
    <>
      <div className="flex flex-row place-content-between pb-2">
        <ProdutosFilter
          nomeProduto={filtros.nomeProduto}
          setNomeProduto={filtros.setNomeProduto}
          codigoProduto={filtros.codigoProduto}
          setCodigoProduto={filtros.setCodigoProduto}
          onSubmit={filtros.onSubmit}
        />
        <CadastroProduto
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
                className="hover:bg-slate-50 cursor-pointer"
              >
                <TableCell className="font-medium text-center text-neutral-700">
                  {produto.nome_produto}
                </TableCell>
                <TableCell className="text-center text-neutral-700">
                  {produto.categoria}
                </TableCell>
                <TableCell className="text-center text-neutral-700">
                  {produto.codigo_produto}
                </TableCell>
                <TableCell className="text-center text-neutral-700">
                  {produto.estoque}
                </TableCell>
                <TableCell className="text-center text-neutral-700">
                  {AdjustPrice(produto.custo)}
                </TableCell>
                <TableCell
                  className="max-w-xs truncate text-center text-neutral-700"
                  title={produto.descricao}
                >
                  {produto.descricao}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProdutoListagem
        open={open}
        produto={selectedProduct}
        onOpenChange={(value) => {
          setOpen(value);
          if (!value) setSelectedProduct(null);
        }}
        onEditar={(produto) => {
          setOpen(false);
          setEditProduct(produto);
          setEditOpen(true);
        }}
        onCadastrar={() => {
          setOpen(false);
          setCadastroOpen(true);
        }}
      />

      <ProdutoEdicao
        open={editOpen}
        onOpenChange={setEditOpen}
        produto={editProduct}
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
