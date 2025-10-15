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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { AdjustDate } from "@/lib/adjustDate";
import { AdjustPrice } from "@/lib/adjustPrice";
import { Pencil } from 'lucide-react';
import { ProdutoEdicao } from "../popUp/produtoEdicao";
import { Produto } from "../../../lib/Produto";

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
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editProduct, setEditProduct] = useState<Produto | null>(null);

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
                  {AdjustPrice(produto.custo)}
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
        <DialogContent className="gap-4">
          <DialogHeader className="flex flex-col gap-4 py-2 border-b">
            <DialogTitle>
              {selectedProduct ? (
                <div className="bold text-1xl flex gap-4">
                  {selectedProduct.nome_produto}
                  <Pencil 
                    className="cursor-pointer w-4 h-4 hover:text-blue-600" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpen(false);
                      setEditProduct(selectedProduct);
                      setEditOpen(true);
                    }}
                  />
                </div>
              ) : (
                <div>Nenhum produto selecionado.</div>
              )}
            </DialogTitle>
            <DialogDescription>Informações do produto</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-sm text-neutral-700">
            {selectedProduct ? (
              <>
                <FieldSet className="pointer-events-none">
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Nome do produto*</FieldLabel>
                      <Input
                        value={selectedProduct.nome_produto}
                        readOnly={true}
                      />
                    </Field>

                    <div className="flex flex-row gap-1">
                      <Field>
                        <FieldLabel>Nome do fornecedor*</FieldLabel>
                        <Input
                          value={
                            selectedProduct.fornecedores?.nome_fornecedor ||
                            "Sem fornecedor"
                          }
                          readOnly={true}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="categoria">
                          Categoria*
                        </FieldLabel>
                        <Input
                          id="categoria"
                          autoComplete="off"
                          value={String(selectedProduct.categoria ?? "-")}
                          readOnly={true}
                        />
                      </Field>
                    </div>

                    <div className="flex flex-row gap-1">
                      <Field>
                        <FieldLabel>Estoque*</FieldLabel>
                        <Input
                          value={
                            selectedProduct.estoque ?? "-"
                          }
                          readOnly={true}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="estoque">
                          Estoque mínimo*
                        </FieldLabel>
                        <Input
                          id="estoque"
                          autoComplete="off"
                          value={String(selectedProduct.estoque_min ?? "-")}
                          readOnly={true}
                        />
                      </Field>
                    </div>

                    <div className="flex flex-row gap-1">
                      <Field>
                        <FieldLabel htmlFor="marca">Marca*</FieldLabel>
                        <Input
                          id="marca"
                          autoComplete="off"
                          value={selectedProduct.marca ?? "-"}
                          readOnly={true}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="codigo">Código*</FieldLabel>
                        <Input
                          id="codigo"
                          autoComplete="off"
                          value={selectedProduct.codigo_produto ?? "-"}
                          readOnly={true}
                        />
                      </Field>
                    </div>

                    <div>
                      <Field>
                        <FieldLabel htmlFor="descricao">Descrição</FieldLabel>
                        <Textarea
                          className="h-[60px]"
                          id="descricao"
                          autoComplete="off"
                          value={selectedProduct.descricao ?? ""}
                          readOnly={true}
                        />
                      </Field>
                    </div>
                    <div className="flex flex-row gap-1">
                      <Field>
                        <FieldLabel htmlFor="preco">Preço</FieldLabel>
                        <Input
                          id="preco"
                          value={
                            selectedProduct.preco !== undefined
                              ? `${AdjustPrice(selectedProduct.preco)}`
                              : "-"
                          }
                          readOnly={true}
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="custo">Custo</FieldLabel>
                        <Input
                          id="custo"
                          value={
                            typeof selectedProduct.custo === "number"
                              ? `${AdjustPrice(selectedProduct.custo)}`
                              : "-"
                          }
                          readOnly={true}
                        />
                      </Field>
                    </div>

                    <div className="flex flex-row gap-1">
                      <Field>
                        <FieldLabel htmlFor="data_cadastro">
                          Data de cadastro
                        </FieldLabel>
                        <Input
                          id="data_cadastro"
                          value={
                            AdjustDate(selectedProduct.data_cadastro) ?? "-"
                          }
                          readOnly={true}
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="data_ultima_entrada">
                          Última entrada
                        </FieldLabel>
                        <Input
                          id="data_ultima_entrada"
                          value={
                            AdjustDate(selectedProduct.data_ultima_entrada) ??
                            "-"
                          }
                          readOnly={true}
                        />
                      </Field>
                    </div>
                  </FieldGroup>
                </FieldSet>
              </>
            ) : (
              <div className="text-neutral-500">
                Nenhum produto selecionado.
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <div className="flex flex-row justify-center gap-1">
              <Button
                className="w-1/2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                onClick={() => window.print()}
              >
                <Printer className="w-4 h-4" /> Imprimir
              </Button>
              <Button
                className="w-1/2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
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

      <ProdutoEdicao 
        open={editOpen}
        onOpenChange={setEditOpen}
        produto={editProduct}
      />
    </>
  );
}
