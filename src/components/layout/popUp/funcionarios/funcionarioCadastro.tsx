"use client";
import { useState } from "react";
import { Save } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { BotaoCadastrar } from "@/components/ui/cadastrarButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FuncionarioSchema, type FormData } from "@/schemas/funcionario";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "@/services/api";
import { capitalizeFirst } from "@/lib/capitalize";
import { formatarTelefone } from "@/lib/adjustPhoneNumber";

interface CadastroFuncionarioProps {
  color: "green" | "blue";
  size: "1/8" | "1/2";
  onTrigger?: () => void;
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
}

export function CadastroFuncionario({
  color,
  size,
  onTrigger,
  open: controlledOpen,
  onOpenChange,
}: CadastroFuncionarioProps) {
  const { data: session } = useSession();
  const [internalOpen, setInternalOpen] = useState<boolean>(false);
  const isControlled = controlledOpen !== undefined;
  const dialogOpen = isControlled ? controlledOpen : internalOpen;

  const form = useForm<FormData>({
    resolver: zodResolver(FuncionarioSchema),
    defaultValues: {
      nome_usuario: "",
      email: "",
      telefone: "",
      perfil: "",
      matricula: "",
    },
  });

  const queryClient = useQueryClient();
  const { mutate: createFuncionario, isPending } = useMutation({
    mutationFn: async (funcionario: FormData) => {
      if (!session?.user?.accesstoken) {
        throw new Error("Usuário não autenticado");
      }

      return await fetchData<any>(
        "/usuarios",
        "POST",
        session.user.accesstoken,
        funcionario
      );
    },

    onSuccess: () => {
      toast.success("Funcionário preenchido com sucesso!", {
        description:
          "O email de ativação de conta foi enviado ao email cadastrado!",
      });

      queryClient.invalidateQueries({ queryKey: ["listaFuncionarios"] });
      handleOpenChange(false);
      form.reset();
    },

    onError: (error: any) => {
      const errorData = error?.response?.data || error?.data || error;
      const errorMessage =
        errorData?.customMessage ||
        errorData?.message ||
        error?.message ||
        "Falha ao cadastrar funcionário";

      toast.error("Erro ao cadastrar funcionário", {
        description: errorMessage,
      });
    },
  });

  const handleOpenChange = (value: boolean) => {
    if (!isControlled) {
      setInternalOpen(value);
    }
    onOpenChange?.(value);

    if (!value) {
      form.reset();
    }
  };

  const onSubmit = (data: FormData) => {
    createFuncionario(data);
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
          <DialogTitle>Cadastro de funcionário</DialogTitle>
          <DialogDescription>
            Formulário para o cadastro de novos funcionários
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-h-96 overflow-y-auto space-y-8 text-neutral-700"
            noValidate
          >
            <FormField
              control={form.control}
              name="nome_usuario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="João da Silva"
                      {...field}
                      onChange={(e) =>
                        field.onChange(capitalizeFirst(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="matricula"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matrícula*</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="ADMIN-003"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    A matrícula deve ser única
                  </FormDescription>
                </FormItem>
              )}
            />

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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
          </form>
        </Form>

        <div className="pt-2 border-t">
          <div className="flex flex-row gap-1 justify-center">
            <Button
              onClick={() => handleOpenChange(false)}
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
