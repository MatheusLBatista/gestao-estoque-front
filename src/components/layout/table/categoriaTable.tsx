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
import { Produto } from "../../../types/Produto";
import { ProdutoListagem } from "../popUp/produto/produtoListagem";
import { ProdutoEdicao } from "../popUp/produto/produtoEdicao";
import { AdjustPrice } from "@/lib/adjustPrice";
import { CustomPagination } from "../pagination/paginationWrapper";
import { ItemsPerPage } from "../pagination/itemsPerPage";
import { AdjustDate } from "@/lib/adjustDate";

interface TabelaCategoriaProdutosProps {
  produtos: Produto[];
}

export default function TabelaCategoriaProdutos({
  produtos,
}: TabelaCategoriaProdutosProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);

  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editProduct, setEditProduct] = useState<Produto | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);

  const totalPages = Math.ceil(produtos.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const produtosPaginados = produtos.slice(startIndex, endIndex);

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left text-neutral-500">
                Nome do Produto
              </TableHead>
              <TableHead className="text-center text-neutral-500">
                Código
              </TableHead>
              <TableHead className="text-center text-neutral-500">
                Estoque
              </TableHead>
              <TableHead className="text-right text-neutral-500">
                Custo
              </TableHead>
              <TableHead className="text-right text-neutral-500">
                Preço
              </TableHead>
              <TableHead className="text-left text-neutral-500">
                Descrição
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {!produtos || produtos.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-neutral-500"
                >
                  Nenhum produto encontrado
                </TableCell>
              </TableRow>
            ) : (
              produtosPaginados.map((produto) => (
                <TableRow
                  key={produto._id}
                  onClick={() => {
                    setSelectedProduct(produto);
                    setOpen(true);
                  }}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <TableCell className="font-medium text-neutral-700">
                    {produto.nome_produto}
                  </TableCell>
                  <TableCell className="text-center font-mono text-sm text-neutral-700">
                    {produto.codigo_produto}
                  </TableCell>
                  <TableCell className="text-center text-neutral-700">
                    {produto.estoque}
                  </TableCell>
                  <TableCell className="text-right text-neutral-700">
                    {AdjustPrice(produto.custo)}
                  </TableCell>
                  <TableCell className="text-right text-neutral-700">
                    {produto.preco ? AdjustPrice(produto.preco) : "-"}
                  </TableCell>
                  <TableCell
                    className="max-w-xs truncate text-neutral-700"
                    title={produto.descricao}
                  >
                    {produto.descricao}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {produtos && produtos.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <ItemsPerPage
            perPage={perPage}
            setPerPage={(value) => {
              setPerPage(value);
              setCurrentPage(1);
            }}
            totalItems={produtos.length}
            tableData={produtos}
            tableTitle="Relatório de Produtos por Categoria"
            tableColumns={[
              { key: "nome_produto", label: "Nome do Produto" },
              { key: "codigo_produto", label: "Código" },
              { key: "estoque", label: "Estoque" },
              {
                key: "custo",
                label: "Custo",
                format: (value) => (value ? AdjustPrice(value) : "-"),
              },
              {
                key: "preco",
                label: "Preço",
                format: (value) => (value ? AdjustPrice(value) : "-"),
              },
              { key: "descricao", label: "Descrição" },
              {
                key: "data_ultima_atualizacao",
                label: "Última atualização",
                format: (value) => (value ? AdjustDate(value) : "-"),
              },
            ]}
          />
          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

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
        }}
      />

      <ProdutoEdicao
        open={editOpen}
        onOpenChange={setEditOpen}
        produto={editProduct}
      />
    </>
  );
}
