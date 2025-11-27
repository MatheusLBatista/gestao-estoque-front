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
import { Funcionario } from "@/types/Funcionario";
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
import {
  useRecordPrint,
  createStatusBadge,
} from "@/components/layout/print/RecordPrint";
import { capitalizeFirst } from "@/lib/capitalize";
import { useSession } from "next-auth/react";
import { canModifyFuncionarios } from "@/lib/permissions";

interface FuncionarioListarProps {
  open: boolean;
  funcionario: Funcionario | null;
  onOpenChange: (value: boolean) => void;
  onEditar: (funcionario: Funcionario) => void;
  onCadastrar: () => void;
  onExcluir?: (funcionario: Funcionario) => void;
}

export function FuncionarioListagem({
  open,
  funcionario,
  onOpenChange,
  onEditar,
  onCadastrar,
  onExcluir,
}: FuncionarioListarProps) {
  const { data: session } = useSession();

  const queryClient = useQueryClient();
  const { printRecord } = useRecordPrint();
  const canModify = canModifyFuncionarios(session?.user?.perfil);

  const handlePrintFuncionario = () => {
    if (!funcionario) {
      toast.error("Nenhum funcionário selecionado para impressão");
      return;
    }

    const sections = [
      {
        title: "Informações Básicas",
        fields: [
          { label: "ID do Funcionário", value: funcionario._id },
          { label: "Status", value: createStatusBadge(funcionario.ativo) },
          {
            label: "Nome do Funcionário",
            value: funcionario.nome_usuario || "-",
          },
          { label: "Matrícula", value: funcionario.matricula || "-" },
          { label: "Perfil", value: funcionario.perfil || "-" },
          { label: "Email", value: funcionario.email || "-" },
          { label: "Telefone", value: funcionario.telefone || "-" },
        ],
      },
      {
        title: "Informações de Sistema",
        fields: [
          {
            label: "Data de Cadastro",
            value: AdjustDate(funcionario.data_cadastro),
          },
          {
            label: "Última Atualização",
            value: AdjustDate(funcionario.data_ultima_atualizacao),
          },
        ],
      },
    ];

    printRecord({
      title: "Detalhes do Funcionário",
      recordId: funcionario.nome_usuario,
      sections,
    });
  };

  const desativarMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.user?.accesstoken) {
        throw new Error("Usuário não autenticado");
      }

      const result = await fetchData(
        `/usuarios/desativar/${funcionario?.matricula}`,
        "PATCH",
        session?.user?.accesstoken
      );
      return result;
    },
    onSuccess: () => {
      toast.success("Funcionário desativado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["listaFuncionarios"] });
      onOpenChange(false);
      if (onExcluir && funcionario) {
        onExcluir(funcionario);
      }
    },
    onError: (error) => {
      toast.error("Erro ao desativar funcionário", {
        description: (error as Error)?.message || "Erro desconhecido",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="gap-4">
        <DialogHeader className="flex flex-col gap-4 py-2 border-b">
          <DialogTitle>
            {funcionario ? (
              <div className="bold text-1xl flex gap-2">
                {funcionario.nome_usuario}
                {canModify && (
                  <Pencil
                    className="cursor-pointer w-4 h-4 hover:text-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditar(funcionario);
                    }}
                  />
                )}
                {canModify && funcionario.ativo && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Trash2
                        className="cursor-pointer w-4 h-4 hover:text-red-600 text-red-500 ml-auto"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Desativar funcionário
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja desativar o funcionário "
                          {funcionario.nome_usuario}"? Esta ação não pode ser
                          desfeita e o funcionário não aparecerá mais na
                          listagem padrão.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            if (funcionario) {
                              desativarMutation.mutate(funcionario._id);
                            }
                          }}
                          disabled={desativarMutation.isPending}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {desativarMutation.isPending
                            ? "Desativando..."
                            : "Desativar"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            ) : (
              <div>Nenhum funcionário selecionado.</div>
            )}
          </DialogTitle>
          <DialogDescription>Informações do funcionário</DialogDescription>
        </DialogHeader>

        <div className="space-y-0.5 text-sm text-neutral-700 max-h-96 overflow-y-auto">
          {funcionario ? (
            <>
              <FieldSet>
                <FieldGroup>
                  <div className="flex flex-row gap-1">
                    <Field>
                      <FieldLabel htmlFor="matricula">Matrícula</FieldLabel>
                      <Input
                        id="matricula"
                        value={funcionario.matricula}
                        readOnly={true}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="status">Status</FieldLabel>
                      <Input
                        id="status"
                        value={funcionario.ativo === true ? "Ativo" : "Inativo"}
                        readOnly={true}
                      />
                    </Field>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="nome_usuario">
                      Nome do funcionário
                    </FieldLabel>
                    <Input
                      id="nome_usuario"
                      value={funcionario.nome_usuario}
                      readOnly={true}
                    />
                  </Field>

                  <div className="flex flex-row gap-1">
                    <Field>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input
                        id="email"
                        value={funcionario.email}
                        autoComplete="off"
                        readOnly={true}
                      />
                    </Field>
                  </div>

                  <div className="flex flex-row gap-1">
                    <Field>
                      <FieldLabel htmlFor="perfil">Perfil</FieldLabel>
                      <Input
                        id="perfil"
                        value={capitalizeFirst(funcionario.perfil)}
                        readOnly={true}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="telefone">Telefone</FieldLabel>
                      <Input
                        id="telefone"
                        value={funcionario.telefone}
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
                        value={AdjustDate(funcionario.data_cadastro) ?? "-"}
                        readOnly={true}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="data_ultima_atualizacao">
                        Data última atualização
                      </FieldLabel>
                      <Input
                        id="data_ultima_atualizacao"
                        value={
                          AdjustDate(funcionario.data_ultima_atualizacao) ?? "-"
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
              Nenhum funcionário selecionado.
            </div>
          )}
        </div>

        <div className="pt-2 border-t">
          <div className="flex flex-row justify-center gap-1">
            <Button
              className="flex-1 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
              onClick={handlePrintFuncionario}
            >
              <Printer className="w-4 h-4" /> Imprimir
            </Button>

            {canModify ? (
              <BotaoCadastrar
                color="blue"
                size="1/2"
                onClick={() => onCadastrar()}
              />
            ) : (
              <Button
                className="flex-1 cursor-pointer text-black bg-transparent border hover:bg-neutral-50"
                onClick={() => onOpenChange(false)}
              >
                Fechar
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
