"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { BotaoCadastrar } from "@/components/ui/cadastrarButton";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import { fetchData } from "@/services/api";
import {
  FornecedorCreateSchema,
  type FornecedorCreateInput,
} from "@/schemas/fornecedor";
import { capitalizeFirst } from "@/lib/capitalize";
import { formatarCnpj } from "@/lib/adjustCNPJ";
import { formatarTelefone } from "@/lib/adjustPhoneNumber";
import { formatarCep } from "@/lib/adjustCep";

interface CadastroFornecedorProps {
  color: "green" | "blue";
  size: "1/8" | "1/2";
  onTrigger?: () => void;
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
}

export default function FornecedorCadastro({
  color,
  size,
  onTrigger,
  open: controlledOpen,
  onOpenChange,
}: CadastroFornecedorProps) {
  const { data: session } = useSession();
  const [internalOpen, setInternalOpen] = useState<boolean>(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const dialogOpen = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = (value: boolean) => {
    if (isControlled) {
      onOpenChange?.(value);
    } else {
      setInternalOpen(value);
    }
    if (!value) {
      form.reset();
    }
  };

  const form = useForm<FornecedorCreateInput>({
    resolver: zodResolver(FornecedorCreateSchema),
    defaultValues: {
      nome_fornecedor: "",
      cnpj: "",
      telefone: "",
      email: "",
      logradouro: "",
      bairro: "",
      cep: "",
      cidade: "",
      estado: "",
    },
  });

  const buscarCep = async (cep: string) => {
    if (!cep || cep.length < 8) return;

    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast.error("CEP não encontrado");
        return;
      }

      form.setValue("logradouro", data.logradouro || "");
      form.setValue("bairro", data.bairro || "");
      form.setValue("cidade", data.localidade || "");
      form.setValue("estado", data.uf || "");

      toast.success("CEP encontrado! Campos preenchidos automaticamente.");
    } catch (error) {
      toast.error("Erro ao buscar CEP");
    } finally {
      setIsLoadingCep(false);
    }
  };

  const queryClient = useQueryClient();
  const { mutate: createFornecedor, isPending } = useMutation({
    mutationFn: async (payload: FornecedorCreateInput) => {
      if (!session?.user?.accesstoken) {
        throw new Error("Usuário não autenticado");
      }

      const body = {
        nome_fornecedor: payload.nome_fornecedor,
        cnpj: payload.cnpj,
        telefone: payload.telefone,
        email: payload.email,
        status: true,
        endereco: [
          {
            logradouro: payload.logradouro,
            bairro: payload.bairro,
            cidade: payload.cidade,
            estado: payload.estado,
            cep: payload.cep,
          },
        ],
      };

      return await fetchData<any>(
        "/fornecedores",
        "POST",
        session.user.accesstoken,
        body
      );
    },

    onSuccess: () => {
      toast.success("Fornecedor cadastrado com sucesso!", {
        description: "O fornecedor foi salvo e adicionado à lista.",
      });

      queryClient.invalidateQueries({ queryKey: ["listaFornecedores"] });
      handleOpenChange(false);
      form.reset();
    },

    onError: (error: any) => {
      console.error("Erro ao cadastrar fornecedor:", error);
      const errorMessage = error?.message || "Erro inesperado";

      if (errorMessage.includes("CNPJ já está cadastrado")) {
        form.setError("cnpj", {
          message: "CNPJ já está cadastrado no sistema",
        });
      } else if (errorMessage.includes("Email já está cadastrado")) {
        form.setError("email", {
          message: "Email já está cadastrado no sistema",
        });
      } else {
        toast.error("Erro ao cadastrar fornecedor", {
          description: errorMessage,
        });
      }
    },
  });

  const onSubmit = (data: FornecedorCreateInput) => {
    createFornecedor(data);
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
          <DialogTitle>Cadastro de fornecedor</DialogTitle>
          <DialogDescription>
            Formulário para o cadastro de novos fornecedores
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-h-96 overflow-y-auto space-y-8 text-neutral-700"
          >
            <FormField
              control={form.control}
              name="nome_fornecedor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do produto*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Auto peças do Sul"
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

            <div className="flex flex-row gap-1">
              <FormField
                control={form.control}
                name="cnpj"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>CNPJ*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="12.345.678/0001-90"
                        {...field}
                        onChange={(e) =>
                          field.onChange(formatarCnpj(e.target.value))
                        }
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
                  <FormItem className="flex-1">
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
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email*</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="contato@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-row gap-1">
              <FormField
                control={form.control}
                name="logradouro"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Logradouro*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Rua Exemplo, 123"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-row gap-1">
              <FormField
                control={form.control}
                name="bairro"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Bairro*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Centro"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cep"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>CEP*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="76980-000"
                        {...field}
                        onChange={(e) =>
                          field.onChange(formatarCep(e.target.value))
                        }
                        onBlur={(e) => {
                          const cep = (
                            e.target as HTMLInputElement
                          ).value.replace(/\D/g, "");
                          if (cep.length === 8) {
                            buscarCep(cep);
                          }
                        }}
                        disabled={isLoadingCep}
                      />
                    </FormControl>
                    {isLoadingCep ? (
                      <div className="text-xs ml-1 mt-1 text-blue-600">
                        Buscando CEP...
                      </div>
                    ) : null}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-row gap-1">
              <FormField
                control={form.control}
                name="cidade"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Cidade*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="São Paulo"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Estado*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="SP"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
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
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isPending || isLoadingCep}
              className="w-1/2 cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
            >
              <Save className="w-4 h-4 mr-1" />{" "}
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
