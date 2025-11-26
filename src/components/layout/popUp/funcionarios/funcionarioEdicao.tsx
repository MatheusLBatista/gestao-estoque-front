"use client";
import { useEffect } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FuncionarioEdicaoSchema,
  type FormDataEdicao,
} from "@/schemas/funcionario";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "@/services/api";
import { Funcionario } from "@/types/Funcionario";
import { formatarTelefone } from "@/lib/adjustPhoneNumber";

interface FuncionarioEdicaoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  funcionario: Funcionario | null;
}

export function FuncionarioEdicao({
  open,
  onOpenChange,
  funcionario,
}: FuncionarioEdicaoProps) {
  const { data: session } = useSession();

  const form = useForm<FormDataEdicao>({
    resolver: zodResolver(FuncionarioEdicaoSchema),
    defaultValues: {
      email: "",
      telefone: "",
      perfil: "",
    },
  });

  useEffect(() => {
    if (funcionario) {
      form.reset({
        email: funcionario.email || "",
        telefone: funcionario.telefone || "",
        perfil: funcionario.perfil || "",
      });
    }
  }, [funcionario, form]);

  const queryClient = useQueryClient();
  const { mutate: updateFuncionario, isPending } = useMutation({
    mutationFn: async (data: FormDataEdicao) => {
      if (!session?.user?.accesstoken) {
        throw new Error("Usuário não autenticado");
      }

      if (!funcionario?._id) {
        throw new Error("ID do funcionário não encontrado");
      }

      return await fetchData<any>(
        `/usuarios/${funcionario.matricula}`,
        "PATCH",
        session.user.accesstoken,
        data
      );
    },

    onSuccess: () => {
      toast.success("Funcionário atualizado com sucesso!", {
        description: "As informações foram salvas.",
      });

      queryClient.invalidateQueries({ queryKey: ["listaFuncionarios"] });
      onOpenChange(false);
    },

    onError: (error: any) => {
      const errorData = error?.response?.data || error?.data || error;
      const errorMessage =
        errorData?.customMessage ||
        errorData?.message ||
        error?.message ||
        "Falha ao atualizar funcionário";

      toast.error("Erro ao atualizar funcionário", {
        description: errorMessage,
      });
    },
  });

  const onSubmit = (data: FormDataEdicao) => {
    updateFuncionario(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="gap-8">
        <DialogHeader className="flex flex-col gap-4 py-2 border-b">
          <DialogTitle>Editar Funcionário</DialogTitle>
          <DialogDescription>
            {funcionario
              ? `Editando informações de ${funcionario.nome_usuario}`
              : "Nenhum funcionário selecionado"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 max-h-96 overflow-y-auto text-neutral-700"
            noValidate
          >
            <div className="space-y-4">
              <div className="space-y-4">
                <div>
                  <FormLabel>Nome completo</FormLabel>
                  <Input
                    className="bg-gray-100 cursor-not-allowed"
                    readOnly
                    value={funcionario?.nome_usuario || ""}
                  />
                </div>

                <div>
                  <FormLabel>Matrícula</FormLabel>
                  <Input
                    className="bg-gray-100 cursor-not-allowed"
                    readOnly
                    value={funcionario?.matricula || ""}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail*</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="joao.silva@empresa.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(11) 99999-9999"
                        {...field}
                        onChange={(e) =>
                          field.onChange(formatarTelefone(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="perfil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perfil*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione um perfil" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="administrador">
                          Administrador
                        </SelectItem>
                        <SelectItem value="gerente">Gerente</SelectItem>
                        <SelectItem value="estoquista">Estoquista</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        <div className="pt-2 border-t">
          <div className="flex flex-row gap-1 justify-center">
            <Button
              onClick={() => onOpenChange(false)}
              className="w-1/2 cursor-pointer text-black bg-transparent border hover:bg-neutral-50"
              type="button"
            >
              Cancelar
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isPending}
              className="w-1/2 cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              type="button"
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
