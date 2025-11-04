import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,  
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Fornecedor } from "@/types/Fornecedor";
import { Pencil, Printer, Trash2 } from "lucide-react";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AdjustDate } from "@/lib/adjustDate";
import { Button } from "@/components/ui/button";
import { BotaoCadastrar } from "@/components/ui/cadastrarButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "@/services/api";
import { toast } from "sonner";

interface FornecedorListarProps {
  open: boolean;
  fornecedor: Fornecedor | null;
  onOpenChange: (value: boolean) => void;
  onEditar: (fornecedor: Fornecedor) => void;
  onCadastrar: () => void;
  onExcluir?: (fornecedor: Fornecedor) => void;
}

export function FornecedorListagem({
  open,
  fornecedor,
  onOpenChange,
  onEditar,
  onCadastrar,
  onExcluir,
}: FornecedorListarProps) {
  const queryClient = useQueryClient();
  
  const desativarMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await fetchData(`/fornecedores/${id}`, "PATCH", undefined, {
        status: false
      });
      return result;
    },
    onSuccess: () => {
      toast.success("Fornecedor desativado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["listaFornecedores"] });
      onOpenChange(false);
      if (onExcluir && fornecedor) {
        onExcluir(fornecedor);
      }
    },
    onError: (error) => {
      toast.error("Erro ao desativar fornecedor", {
        description: (error as Error)?.message || "Erro desconhecido",
      });
    },
  });

  const enderecoFornecedor = fornecedor?.endereco?.[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-4">
        <DialogHeader className="flex flex-col gap-4 py-2 border-b">
          <DialogTitle>
            {fornecedor ? (
              <div className="bold text-1xl flex gap-2">
                {fornecedor.nome_fornecedor}
                <Pencil
                  className="cursor-pointer w-4 h-4 hover:text-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditar(fornecedor);
                  }}
                />
                {fornecedor.status && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Trash2
                        className="cursor-pointer w-4 h-4 hover:text-red-600 text-red-500 ml-auto"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Desativar fornecedor</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja desativar o fornecedor "{fornecedor.nome_fornecedor}"? 
                          Esta ação não pode ser desfeita e o fornecedor não aparecerá mais na listagem padrão.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            if (fornecedor) {
                              desativarMutation.mutate(fornecedor._id);
                            }
                          }}
                          disabled={desativarMutation.isPending}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {desativarMutation.isPending ? "Desativando..." : "Desativar"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            ) : (
              <div>Nenhum fornecedor selecionado.</div>
            )}
          </DialogTitle>
          <DialogDescription>Informações do fornecedor</DialogDescription>
        </DialogHeader>

        <div className="space-y-0.5 text-sm text-neutral-700 max-h-96 overflow-y-auto">
          {fornecedor ? (
            <>
              <FieldSet>
                <FieldGroup>
                  <div className="flex flex-row gap-1">
                    <Field>
                    <FieldLabel htmlFor="id">ID do fornecedor</FieldLabel>
                    <Input id="id" value={fornecedor._id} readOnly={true} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="status">Status</FieldLabel>
                    <Input id="status" value={(fornecedor.status === true ? "Ativo" : "Inativo")} readOnly={true} />
                  </Field>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="nome_fornecedor">
                      Nome do fornecedor
                    </FieldLabel>
                    <Input
                      id="nome_fornecedor"
                      value={fornecedor.nome_fornecedor}
                      readOnly={true}
                    />
                  </Field>

                  <div className="flex flex-row gap-1">
                    <Field>
                      <FieldLabel htmlFor="telefone">Telefone</FieldLabel>
                      <Input
                        id="telefone"
                        value={fornecedor.telefone}
                        readOnly={true}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="cnpj">CNPJ</FieldLabel>
                      <Input
                        id="cnpj"
                        autoComplete="off"
                        value={fornecedor.cnpj}
                        readOnly={true}
                      />
                    </Field>
                  </div>

                  <div className="flex flex-row gap-1">
                    <Field>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input
                        id="email"
                        value={fornecedor.email}
                        autoComplete="off"
                        readOnly={true}
                      />
                    </Field>
                  </div>

                  <div className="flex flex-row gap-1">
                    <Field>
                      <FieldLabel htmlFor="logradouro">Logradouro</FieldLabel>
                      <Input
                        id="logradouro"
                        value={enderecoFornecedor?.logradouro}
                        autoComplete="off"
                        readOnly={true}
                      />
                    </Field>
                  </div>

                  <div className="flex flex-row gap-1">
                    <Field>
                      <FieldLabel htmlFor="cep">CEP</FieldLabel>
                      <Input
                        id="cep"
                        value={enderecoFornecedor?.cep}
                        readOnly={true}
                        autoComplete="off"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="bairro">Bairro</FieldLabel>
                      <Input
                        id="bairro"
                        value={enderecoFornecedor?.bairro}
                        autoComplete="off"
                        readOnly={true}
                      />
                    </Field>
                  </div>

                  <div className="flex flex-row gap-1">
                    <Field>
                      <FieldLabel htmlFor="cidade">Cidade</FieldLabel>
                      <Input
                        id="cidade"
                        value={enderecoFornecedor?.cidade}
                        autoComplete="off"
                        readOnly={true}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="estado">Estado</FieldLabel>
                      <Input
                        id="estado"
                        value={enderecoFornecedor?.estado}
                        autoComplete="off"
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
                        value={AdjustDate(fornecedor.data_cadastro) ?? "-"}
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
                          AdjustDate(fornecedor.data_ultima_atualizacao) ?? "-"
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
              Nenhum fornecedor selecionado.
            </div>
          )}
        </div>

        <div className="pt-2 border-t">
          <div className="flex flex-row justify-center gap-1">
            <Button
              className="flex-1 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
              onClick={() => window.print()}
            >
              <Printer className="w-4 h-4" /> Imprimir
            </Button>
            
            <BotaoCadastrar
              color="blue"
              size="1/2"
              onClick={() => onCadastrar()}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
