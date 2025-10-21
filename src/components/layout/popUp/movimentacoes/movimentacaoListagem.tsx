"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Movimentacao } from "@/types/Movimentacao";
import { Printer, Pencil } from "lucide-react";
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
  onEditar?: (m: Movimentacao) => void;
}

function formatCurrency(value: number | string | undefined) {
  if (value === undefined || value === null) return "-";
  return AdjustPrice(value as any);
}

export function MovimentacaoListagem({
  open,
  movimentacao,
  onOpenChange,
  onEditar,
}: MovimentacaoListarProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-4 max-w-2xl">
        <DialogHeader className="flex flex-col gap-4 py-2 border-b">
          <DialogTitle>
            {movimentacao ? (
              <div className="bold text-1xl flex gap-2">
                Movimentação - {movimentacao._id}
                {onEditar && (
                  <Pencil
                    className="cursor-pointer w-4 h-4 hover:text-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      movimentacao && onEditar(movimentacao);
                    }}
                  />
                )}
              </div>
            ) : (
              <div>Nenhuma movimentação selecionada.</div>
            )}
          </DialogTitle>
          <DialogDescription>Detalhes da movimentação</DialogDescription>
        </DialogHeader>

        <div className="space-y-0.5 text-sm text-neutral-700">
          {movimentacao ? (
            <FieldSet className="pointer-events-none">
              <FieldGroup>
                <Field>
                  <FieldLabel>ID</FieldLabel>
                  <Input value={movimentacao._id} readOnly />
                </Field>

                <Field>
                  <FieldLabel>Tipo</FieldLabel>
                  <Input value={String(movimentacao.tipo ?? "-")} readOnly />
                </Field>

                <Field>
                  <FieldLabel>Produto</FieldLabel>
                  <Input
                    value={
                      // movimentacao.produto?.nome_produto ||
                      // movimentacao.produto_nome ||
                      "-"
                    }
                    readOnly
                  />
                </Field>

                <Field>
                  <FieldLabel>Destino</FieldLabel>
                  <Input value={movimentacao.destino || "-"} readOnly />
                </Field>

                <Field>
                  <FieldLabel>Custo</FieldLabel>
                  {/* <Input value={formatCurrency(movimentacao.custo)} readOnly /> */}
                </Field>

                <Field>
                  <FieldLabel>Quantidade</FieldLabel>
                  <Input
                    // value={String(movimentacao.quantidade ?? "-")}
                    readOnly
                  />
                </Field>

                <Field>
                  <FieldLabel>Data</FieldLabel>
                  <Input
                    value={AdjustDate(
                      movimentacao.data_cadastro
                    )}
                    readOnly
                  />
                </Field>

                {movimentacao.observacoes && (
                  <Field>
                    <FieldLabel>Observação</FieldLabel>
                    <Input value={movimentacao.observacoes} readOnly />
                    <FieldDescription className="text-[10px] mx-2 my-0">
                      Observações adicionadas na movimentação
                    </FieldDescription>
                  </Field>
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
            <Button
              onClick={() => onOpenChange(false)}
              className="w-1/2 cursor-pointer text-black bg-transparent border hover:bg-neutral-50"
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
