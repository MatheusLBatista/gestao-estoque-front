"use client";
import { useState } from "react";
import { Bot, Package, Plus, Save, Trash } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BotaoCadastrar } from "@/components/ui/cadastrarButton";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";

interface Produtos {
  id: string;
  codigo: string;
  valor: number;
  quantidade: number;
}

interface CadastrarMovimentacaoProps {
  color: "green" | "blue";
  size: "1/8" | "1/2";
  onTrigger?: () => void;
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
}

export function CadastroMovimentacao({
  color,
  size,
  onTrigger,
  open: controlledOpen,
  onOpenChange,
}: CadastrarMovimentacaoProps) {
  const [internalOpen, setInternalOpen] = useState<boolean>(false);
  const isControlled = controlledOpen !== undefined;
  const dialogOpen = isControlled ? controlledOpen : internalOpen;
  const [produtos, setProdutos] = useState<Produtos[]>([]);
  const [tipo, setTipo] = useState<string>();
  const [destino, setDestino] = useState<string>("");

  const handleOpenChange = (value: boolean) => {
    if (!isControlled) {
      setInternalOpen(value);
    }
    onOpenChange?.(value);
  };

  const adicionarProduto = () => {
    const novoProduto: Produtos = {
      id: "",
      codigo: "",
      quantidade: 0,
      valor: 0,
    };
    setProdutos([...produtos, novoProduto]);
  };

  const removerProduto = (index: number) => {
    const novosProdutos = produtos.filter((_, i) => i !== index);
    setProdutos(novosProdutos);
  };

  const atualizarProduto = (
    index: number,
    campo: keyof Produtos,
    valor: string
  ) => {
    const novosProdutos = [...produtos];
    novosProdutos[index][campo] = valor as never;
    setProdutos(novosProdutos);
  };

  const save = () => {
    if (!tipo || !destino) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (produtos.length === 0) {
      toast.error("Cadastre pelo menos um produto");
      return;
    }

    toast.success("Movimentação cadastrada com sucesso!", {
      description: "A movimentação foi salva e adicionada à lista.",
    });

    handleOpenChange(false);
    setTipo(undefined);
    setDestino("");
    setProdutos([]);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <BotaoCadastrar
          onClick={() => {
            onTrigger?.();
          }}
          color={color}
          size={size}
        />
      </DialogTrigger>

      <DialogContent className="gap-8">
        <DialogHeader className="flex flex-col gap-4 py-2 border-b">
          <DialogTitle>Cadastro de movimentações</DialogTitle>
          <DialogDescription>
            Formulário para o cadastro de novas movimentações
          </DialogDescription>
        </DialogHeader>

        <FieldSet className="max-h-96 overflow-y-auto">
          <FieldGroup>
            <div className="flex flex-row gap-1">
              <Field>
                <FieldLabel htmlFor="tipo">Tipo*</FieldLabel>
                <Select value={tipo} onValueChange={setTipo}>
                  <SelectTrigger id="tipo">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrada">Entrada</SelectItem>
                    <SelectItem value="saida">Saída</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="destino">Destino*</FieldLabel>
                <Input
                  id="destino"
                  autoComplete="off"
                  placeholder="Depósito José"
                  value={destino}
                  onChange={(e) => {
                    setDestino(e.target.value);
                  }}
                />
              </Field>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-t pt-4">
                <FieldLabel className="text-base font-semibold">
                  Produtos
                </FieldLabel>
                <Button
                  type="button"
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                  onClick={adicionarProduto}
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar produto
                </Button>
              </div>

              {produtos.length === 0 && (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-md">
                  <Package className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p>Nenhum produto adicionado</p>
                  <p className="text-sm">
                    Clique em "Adicionar Produto" para iniciar
                  </p>
                </div>
              )}

              {produtos.map((produto, index) => (
                <div key={index} className="border rounded-md p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">
                      Produto {index + 1}
                    </span>
                    <Button
                      type="button"
                      onClick={() => removerProduto(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-100 cursor-pointer"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-row gap-1">
                      <Field>
                        <FieldLabel htmlFor={`id-${index}`}>
                          ID produto*
                        </FieldLabel>
                        <Input
                          id={`id-${index}`}
                          autoComplete="off"
                          placeholder="68dc2e978a45b02c6d047c00"
                          value={produto.id}
                          onChange={(e) =>
                            atualizarProduto(index, "id", e.target.value)
                          }
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor={`codigo-${index}`}>
                          Código*
                        </FieldLabel>
                        <Input
                          id={`codigo-${index}`}
                          autoComplete="off"
                          placeholder="ABC-1212"
                          value={produto.codigo}
                          onChange={(e) =>
                            atualizarProduto(index, "codigo", e.target.value)
                          }
                        />
                      </Field>
                    </div>

                    <div className="flex flex-row gap-1">
                      <Field>
                        <FieldLabel htmlFor={`valor-${index}`}>
                          {tipo === "entrada" ? "Custo (R$)*" : "Valor (R$)*"}
                        </FieldLabel>
                        <Input
                          id={`valor-${index}`}
                          type="number"
                          autoComplete="off"
                          placeholder="150.00"
                          value={produto.valor}
                          onChange={(e) =>
                            atualizarProduto(index, "valor", e.target.value)
                          }
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor={`quantidade-${index}`}>
                          Quantidade*
                        </FieldLabel>
                        <Input
                          id={`quantidade-${index}`}
                          type="number"
                          autoComplete="off"
                          placeholder="12"
                          value={produto.quantidade}
                          onChange={(e) =>
                            atualizarProduto(
                              index,
                              "quantidade",
                              e.target.value
                            )
                          }
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FieldGroup>
        </FieldSet>
        <div className="flex flex-row gap-2 justify-end">
          <Button
            onClick={() => handleOpenChange(false)}
            className="cursor-pointer text-black bg-transparent border hover:bg-neutral-50"
            data-slot="dialog-close"
          >
            Cancelar
          </Button>
          <Button
            onClick={save}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-1" /> Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
