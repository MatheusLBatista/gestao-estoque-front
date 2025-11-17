"use client";
import { useState, useRef } from "react";
import { Bot, Package, Plus, Save, Trash } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { NumericFormat } from "react-number-format";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MovimentacaoCreateInput,
  MovimentacaoCreateSchema,
} from "@/schemas/movimentacao";
import { fetchData } from "@/services/api";
import { capitalizeFirst } from "@/lib/capitalize";

interface Produtos {
  id: string;
  codigo: string;
  nome: string;
  valor: number | undefined;
  quantidade: number | undefined;
}

interface NotaFiscal {
  numero: string;
  serie: string;
  chave: string;
  data_emissao: string;
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
  const { data: session } = useSession();
  const [internalOpen, setInternalOpen] = useState<boolean>(false);
  const isControlled = controlledOpen !== undefined;
  const dialogOpen = isControlled ? controlledOpen : internalOpen;
  const [produtos, setProdutos] = useState<Produtos[]>([]);
  const [tipo, setTipo] = useState<string>();
  const [destino, setDestino] = useState<string>("");
  const [observacoes, setObservacoes] = useState<string>("");
  const [notaFiscal, setNotaFiscal] = useState<NotaFiscal>({
    numero: "",
    serie: "",
    chave: "",
    data_emissao: "",
  });

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [formData, setFormData] = useState({
    tipo: "",
    destino: "",
    observacoes: "",
    id_produto: "",
    codigo: "",
    valor: "",
    quantidade: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const clearFieldError = (fieldName: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const clearServerErrors = () => {
    setErrors((prev) => {
      const newErrors = { ...prev };

      return newErrors;
    });
  };

  const queryClient = useQueryClient();
  const { mutate: createMovimentacao, isPending } = useMutation({
    mutationFn: async (movimentacao: MovimentacaoCreateInput) => {
      if (!session?.user?.accesstoken) {
        throw new Error("Usuário não autenticado");
      }

      const body = {
        tipo: movimentacao.tipo,
        destino: movimentacao.destino,
        observacoes: movimentacao.observacoes,
        nota_fiscal: movimentacao.nota_fiscal,
        produtos: movimentacao.produtos.map((produto) => ({
          _id: produto.idProduto,
          codigo_produto: produto.codigo_produto,
          quantidade_produtos: produto.quantidade_produtos,
          ...(movimentacao.tipo === "entrada"
            ? { custo: produto.custo }
            : { preco: produto.preco }),
        })),
      };

      return await fetchData<any>(
        "/movimentacoes",
        "POST",
        session.user.accesstoken,
        body
      );
    },

    onSuccess: () => {
      toast.success("Movimentação cadastrada com sucesso!", {
        description: "A movimentação foi salva e adicionada à lista.",
      });

      queryClient.invalidateQueries({ queryKey: ["listarMovimentacoes"] });
      handleOpenChange(false);

      setTipo(undefined);
      setDestino("");
      setObservacoes("");
      setProdutos([]);
      setNotaFiscal({
        numero: "",
        serie: "",
        chave: "",
        data_emissao: "",
      });
      setFormData({
        tipo: "",
        destino: "",
        observacoes: "",
        id_produto: "",
        codigo: "",
        valor: "",
        quantidade: "",
      });
      setErrors({});
    },

    onError: (error: any) => {
      const errorData = error?.response?.data || error?.data || error;
      const errorMessage =
        errorData?.customMessage ||
        errorData?.message ||
        error?.message ||
        error?.toString() ||
        "";
      const lowerMessage = errorMessage.toLowerCase();

      const message = errorMessage || "Falha ao cadastrar movimentação";
      toast.error("Erro ao cadastrar movimentação", { description: message });
    },
  });

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
      nome: "",
      quantidade: undefined,
      valor: undefined,
    };
    setProdutos([...produtos, novoProduto]);
  };

  const buscarProdutoPorCodigo = async (codigo: string, index: number) => {
    if (!codigo.trim()) {
      atualizarProduto(index, "id", "");
      atualizarProduto(index, "nome", "");
      return;
    }

    if (!session?.user?.accesstoken) {
      setErrors((prev) => ({
        ...prev,
        [`produto_${index}_codigo`]: "Usuário não autenticado",
      }));
      return;
    }

    try {
      console.log(`Buscando produto com código: ${codigo}`);
      const response = await fetchData<any>(
        `/produtos?codigo_produto=${codigo}`,
        "GET",
        session.user.accesstoken
      );

      console.log("Resposta da busca:", response);

      if (
        response &&
        response.data &&
        response.data.docs &&
        response.data.docs.length > 0
      ) {
        const produto = response.data.docs[0];
        console.log(
          `Produto encontrado - ID: ${produto._id}, Nome: ${produto.nome_produto}`
        );
        atualizarProduto(index, "id", produto._id);
        atualizarProduto(index, "nome", produto.nome_produto);

        clearFieldError(`produto_${index}_codigo`);
      } else {
        console.log("Nenhum produto encontrado");
        atualizarProduto(index, "id", "");
        atualizarProduto(index, "nome", "");
        setErrors((prev) => ({
          ...prev,
          [`produto_${index}_codigo`]: "Produto não encontrado",
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      atualizarProduto(index, "id", "");
      atualizarProduto(index, "nome", "");
      setErrors((prev) => ({
        ...prev,
        [`produto_${index}_codigo`]: "Erro ao buscar produto",
      }));
    }
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

  const atualizarNotaFiscal = (campo: keyof NotaFiscal, valor: string) => {
    setNotaFiscal((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const save = () => {
    if (!tipo || !destino || produtos.length === 0) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const produtosSemCodigo = produtos.filter(
      (produto) => !produto.codigo.trim()
    );
    if (produtosSemCodigo.length > 0) {
      toast.error("Preencha o código de todos os produtos");
      return;
    }

    const produtosSemID = produtos.filter((produto) => !produto.id.trim());
    if (produtosSemID.length > 0) {
      toast.error(
        "Alguns produtos não foram encontrados. Aguarde a busca ou verifique os códigos."
      );
      return;
    }

    const produtosSemDados = produtos.filter(
      (produto) => !produto.quantidade || !produto.valor
    );
    if (produtosSemDados.length > 0) {
      toast.error("Preencha quantidade e valor de todos os produtos");
      return;
    }

    const payload = {
      tipo: tipo as "entrada" | "saida",
      destino,
      observacoes: observacoes || undefined,
      nota_fiscal:
        tipo === "entrada" &&
        (notaFiscal.numero ||
          notaFiscal.serie ||
          notaFiscal.chave ||
          notaFiscal.data_emissao)
          ? {
              numero: notaFiscal.numero || undefined,
              serie: notaFiscal.serie || undefined,
              chave: notaFiscal.chave || undefined,
              data_emissao: notaFiscal.data_emissao
                ? new Date(notaFiscal.data_emissao)
                : undefined,
            }
          : undefined,
      produtos: produtos.map((produto) => ({
        idProduto: produto.id,
        codigo_produto: produto.codigo,
        quantidade_produtos: Number(produto.quantidade) || 0,
        custo: tipo === "entrada" ? Number(produto.valor) || 0 : 0,
        preco: tipo === "saida" ? Number(produto.valor) || 0 : 0,
      })),
    };

    const result = MovimentacaoCreateSchema.safeParse(payload);

    if (!result.success) {
      console.log("Erros de validação:", result.error.issues);
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((e) => {
        if (e.path[0]) {
          fieldErrors[e.path[0] as string] = e.message;
        }
      });
      setErrors(fieldErrors);
      toast.error("Verifique os campos obrigatórios!");
      return;
    }

    createMovimentacao(result.data);
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

      <DialogContent showCloseButton={false} className="gap-8">
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
                    setDestino(capitalizeFirst(e.target.value));
                  }}
                />
              </Field>
            </div>

            {/* Seção de Nota Fiscal - Apenas para Entrada */}
            {tipo === "entrada" && (
              <div className="space-y-2 border-t pt-4">
                <FieldLabel className="text-base font-semibold">
                  Nota Fiscal
                </FieldLabel>
                <div className="flex flex-row gap-1">
                  <Field>
                    <FieldLabel htmlFor="nf-numero">Número</FieldLabel>
                    <Input
                      id="nf-numero"
                      autoComplete="off"
                      placeholder="000348325"
                      type="text"
                      inputMode="numeric"
                      maxLength={9}
                      value={String(notaFiscal.numero)}
                      onChange={(e) =>
                        atualizarNotaFiscal("numero", e.target.value)
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="nf-serie">Série</FieldLabel>
                    <Input
                      id="nf-serie"
                      autoComplete="off"
                      placeholder="2"
                      maxLength={1}
                      type="text"
                      inputMode="numeric"
                      value={String(notaFiscal.serie)}
                      onChange={(e) =>
                        atualizarNotaFiscal("serie", e.target.value)
                      }
                    />
                  </Field>
                </div>
                <div className="flex flex-row gap-1">
                  <Field>
                    <FieldLabel htmlFor="nf-chave">Chave de Acesso</FieldLabel>
                    <Input
                      id="nf-chave"
                      autoComplete="off"
                      type="text"
                      placeholder="352007142001660001875500200003483251234567890"
                      inputMode="numeric"
                      minLength={44}
                      maxLength={44}
                      value={String(notaFiscal.chave)}
                      onChange={(e) =>
                        atualizarNotaFiscal("chave", e.target.value)
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="nf-data">Data de Emissão</FieldLabel>
                    <Input
                      id="nf-data"
                      type="date"
                      autoComplete="off"
                      value={notaFiscal.data_emissao}
                      onChange={(e) =>
                        atualizarNotaFiscal("data_emissao", e.target.value)
                      }
                    />
                  </Field>
                </div>
              </div>
            )}

            {/* Campo de Observações */}
            <div className="space-y-2 border-t pt-4">
              <Field>
                <FieldLabel htmlFor="observacoes">Observações</FieldLabel>
                <Textarea
                  id="observacoes"
                  placeholder="Informações adicionais sobre a movimentação..."
                  value={observacoes}
                  onChange={(e) =>
                    setObservacoes(capitalizeFirst(e.target.value))
                  }
                  rows={3}
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
                        <FieldLabel htmlFor={`codigo-${index}`}>
                          Código do Produto*
                        </FieldLabel>
                        <Input
                          id={`codigo-${index}`}
                          autoComplete="off"
                          placeholder="ABC-1212"
                          value={produto.codigo}
                          onChange={(e) => {
                            atualizarProduto(index, "codigo", e.target.value);
                            // Buscar produto após 500ms de delay (debounce)
                            if (searchTimeoutRef.current) {
                              clearTimeout(searchTimeoutRef.current);
                            }
                            searchTimeoutRef.current = setTimeout(() => {
                              buscarProdutoPorCodigo(e.target.value, index);
                            }, 500);
                          }}
                        />
                        {errors[`produto_${index}_codigo`] && (
                          <FieldError>
                            {errors[`produto_${index}_codigo`]}
                          </FieldError>
                        )}
                      </Field>

                      <Field>
                        <FieldLabel htmlFor={`nome-${index}`}>
                          Nome do Produto
                        </FieldLabel>
                        <Input
                          id={`nome-${index}`}
                          autoComplete="off"
                          placeholder="Nome será preenchido automaticamente"
                          value={produto.nome}
                          readOnly
                          className="bg-gray-100"
                        />
                      </Field>
                    </div>

                    <div className="flex flex-row gap-1">
                      <Field>
                        <FieldLabel htmlFor={`valor-${index}`}>
                          {tipo === "entrada" ? "Custo (R$)*" : "Valor (R$)*"}
                        </FieldLabel>

                        <NumericFormat
                          id={`valor-${index}`}
                          autoComplete="off"
                          placeholder="R$ 1.150,00"
                          value={produto.valor}
                          thousandSeparator="."
                          decimalSeparator=","
                          fixedDecimalScale
                          allowNegative={false}
                          prefix="R$ "
                          customInput={Input}
                          onChange={(e) =>
                            atualizarProduto(index, "valor", (e.target.value))
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
        <div className="pt-2 border-t">
          <div className="flex flex-row justify-center gap-1">
            <Button
              onClick={() => handleOpenChange(false)}
              className="w-1/2 cursor-pointer text-black bg-transparent border hover:bg-neutral-50"
              data-slot="dialog-close"
            >
              Cancelar
            </Button>
            <Button
              onClick={save}
              disabled={isPending}
              className="w-1/2 cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-1" />
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
