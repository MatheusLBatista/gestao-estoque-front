"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Movimentacao } from "@/types/Movimentacao";
import { Printer, Plus } from "lucide-react";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdjustPrice } from "@/lib/adjustPrice";
import { AdjustDate } from "@/lib/adjustDate";

interface MovimentacaoListarProps {
  open: boolean;
  movimentacao: Movimentacao | null;
  onOpenChange: (value: boolean) => void;
  onNovaMovimentacao?: () => void;
}

export function MovimentacaoListagem({
  open,
  movimentacao,
  onOpenChange,
  onNovaMovimentacao,
}: MovimentacaoListarProps) {
  const getProdutoNome = () => {
    if (!movimentacao?.produtos?.length) return "-";
    const firstProduct = movimentacao.produtos[0];
    if (
      typeof firstProduct._id === "object" &&
      firstProduct._id?.nome_produto
    ) {
      return firstProduct._id.nome_produto;
    }
    return "-";
  };

  const getQuantidadeProdutos = () => {
    if (!movimentacao?.produtos?.length) return 0;
    return movimentacao.produtos.reduce((total, produto) => {
      return total + (produto.quantidade_produtos || 0);
    }, 0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-4 max-w-2xl">
        <DialogHeader className="flex flex-col gap-4 py-2 border-b">
          <DialogTitle>
            {movimentacao ? (
              <div className="bold text-1xl">
                Movimentação {movimentacao.tipo} - {movimentacao._id.slice(-12)}
              </div>
            ) : (
              <div>Nenhuma movimentação selecionada.</div>
            )}
          </DialogTitle>
          <DialogDescription>Detalhes da movimentação</DialogDescription>
        </DialogHeader>

        <div className="space-y-0.5 text-sm text-neutral-700 max-h-96 overflow-y-auto">
          {movimentacao ? (
            <FieldSet className="pointer-events-none">
              <FieldGroup>
                <div className="flex flex-row gap-1">
                  <Field>
                    <FieldLabel>ID do usuário responsável</FieldLabel>
                    <Input
                      value={
                        typeof movimentacao.id_usuario === "object"
                          ? movimentacao.id_usuario._id
                          : movimentacao.id_usuario || "-"
                      }
                      readOnly
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Email usuário</FieldLabel>
                    <Input
                      value={
                        typeof movimentacao.id_usuario === "object"
                          ? movimentacao.id_usuario.email
                          : "joao@email.com"
                      }
                      readOnly
                    />
                  </Field>
                </div>

                <div className="flex flex-row gap-1">
                  <Field>
                    <FieldLabel>Destino</FieldLabel>
                    <Input
                      value={movimentacao.destino || "Depósito principal"}
                      readOnly
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Usuário responsável</FieldLabel>
                    <Input
                      value={
                        typeof movimentacao.id_usuario === "object"
                          ? movimentacao.id_usuario.nome_usuario
                          : "João Silva"
                      }
                      readOnly
                    />
                  </Field>
                </div>

                <div className="flex flex-row gap-1">
                  <Field>
                    <FieldLabel>ID do produto</FieldLabel>
                    <Input value={movimentacao._id.slice(-12)} readOnly />
                  </Field>
                  <Field>
                    <FieldLabel>Nome do produto</FieldLabel>
                    <Input value={getProdutoNome()} readOnly />
                  </Field>
                </div>

                {/* Lista de produtos com scroll */}
                {movimentacao.produtos && movimentacao.produtos.length > 0 && (
                  <div className="space-y-2">
                    <FieldLabel className="text-sm font-medium">
                      Produtos na movimentação
                    </FieldLabel>
                    <div className="max-h-32 overflow-y-auto border rounded-md p-2 bg-gray-50">
                      {movimentacao.produtos.map((produto, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-1 px-2 bg-white rounded mb-1 last:mb-0 text-xs"
                        >
                          <div className="flex-1">
                            <span className="font-medium">
                              {typeof produto._id === "object"
                                ? produto._id.nome_produto
                                : produto.codigo_produto}
                            </span>
                          </div>
                          <div className="flex gap-4 text-gray-600">
                            <span>Qtd: {produto.quantidade_produtos}</span>
                            <span>
                              {movimentacao.tipo === "entrada"
                                ? `Custo: ${AdjustPrice(
                                    (produto as any).custo || 0
                                  )}`
                                : `Preço: ${AdjustPrice(
                                    (produto as any).preco || 0
                                  )}`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-row gap-1">
                  <Field>
                    <FieldLabel>Estoque mínimo</FieldLabel>
                    <Input value="8" readOnly />
                  </Field>
                  <Field>
                    <FieldLabel>Unidades em estoque</FieldLabel>
                    <Input value="50" readOnly />
                  </Field>
                </div>

                <div className="flex flex-row gap-1">
                  <Field>
                    <FieldLabel>Preço de venda</FieldLabel>
                    <Input
                      value={AdjustPrice(movimentacao.totalPreco || 0)}
                      readOnly
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Preço de custo</FieldLabel>
                    <Input
                      value={AdjustPrice(movimentacao.totalCusto || 0)}
                      readOnly
                    />
                  </Field>
                </div>

                <div className="flex flex-row gap-1">
                  <Field>
                    <FieldLabel>Data de cadastro</FieldLabel>
                    <Input
                      value={AdjustDate(movimentacao.data_cadastro)}
                      readOnly
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Data última atualização</FieldLabel>
                    <Input value="--/--/----" readOnly />
                  </Field>
                </div>

                <div className="flex flex-row gap-1">
                  <Field>
                    <FieldLabel>ID fornecedor</FieldLabel>
                    <Input value={movimentacao._id.slice(-12)} readOnly />
                  </Field>
                  <Field>
                    <FieldLabel>Nome do fornecedor</FieldLabel>
                    <Input value="Distribuidora Central Ltda" readOnly />
                  </Field>
                </div>

                {/* Observações */}
                {movimentacao.observacoes && (
                  <Field>
                    <FieldLabel>Observações</FieldLabel>
                    <Input value={movimentacao.observacoes} readOnly />
                  </Field>
                )}

                {/* Nota Fiscal - Apenas para Entrada */}
                {movimentacao.tipo === "entrada" &&
                  (movimentacao as any).nota_fiscal && (
                    <div className="space-y-2 border-t pt-4">
                      <FieldLabel className="text-base font-semibold">
                        Nota Fiscal
                      </FieldLabel>
                      <div className="flex flex-row gap-1">
                        <Field>
                          <FieldLabel>Número</FieldLabel>
                          <Input
                            value={
                              (movimentacao as any).nota_fiscal.numero || "-"
                            }
                            readOnly
                          />
                        </Field>
                        <Field>
                          <FieldLabel>Série</FieldLabel>
                          <Input
                            value={
                              (movimentacao as any).nota_fiscal.serie || "-"
                            }
                            readOnly
                          />
                        </Field>
                      </div>
                      <div className="flex flex-row gap-1">
                        <Field>
                          <FieldLabel>Chave de Acesso</FieldLabel>
                          <Input
                            value={
                              (movimentacao as any).nota_fiscal.chave || "-"
                            }
                            readOnly
                          />
                        </Field>
                        <Field>
                          <FieldLabel>Data de Emissão</FieldLabel>
                          <Input
                            value={
                              (movimentacao as any).nota_fiscal.data_emissao
                                ? AdjustDate(
                                    (movimentacao as any).nota_fiscal
                                      .data_emissao
                                  )
                                : "-"
                            }
                            readOnly
                          />
                        </Field>
                      </div>
                    </div>
                  )}
              </FieldGroup>
            </FieldSet>
          ) : (
            <div className="text-neutral-500">
              Nenhuma movimentação selecionada.
            </div>
          )}
        </div>

        <div className="pt-2 border-t">
          <div className="flex flex-row justify-center gap-1">
            <Button
              className="w-1/2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
              onClick={() => window.print()}
            >
              <Printer className="w-4 h-4" /> Imprimir
            </Button>
            {onNovaMovimentacao && (
              <Button
                onClick={onNovaMovimentacao}
                className="w-1/2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Nova movimentação
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
