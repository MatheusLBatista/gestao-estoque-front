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
import { Textarea } from "@/components/ui/textarea";
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
import { ProdutoSchema, type FormData } from "@/schemas/produto";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "@/services/api";
import { Fornecedor } from "@/types/Fornecedor";
import { NumericFormat } from "react-number-format";
import { capitalizeFirst } from "@/lib/capitalize";

interface CadastroProdutoProps {
  color: "green" | "blue";
  size: "1/8" | "1/2";
  onTrigger?: () => void;
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
}

export function CadastroProduto({
  color,
  size,
  onTrigger,
  open: controlledOpen,
  onOpenChange,
}: CadastroProdutoProps) {
  const { data: session } = useSession();
  const [internalOpen, setInternalOpen] = useState<boolean>(false);
  const isControlled = controlledOpen !== undefined;
  const dialogOpen = isControlled ? controlledOpen : internalOpen;

  const { data: fornecedores, isLoading: isLoadingFornecedores } = useQuery({
    queryKey: ["listaFornecedores"],
    queryFn: async () => {
      if (!session?.user?.accesstoken) {
        throw new Error("Usuário não autenticado");
      }
      const result = await fetchData<{
        data: {
          docs: Fornecedor[];
          totalDocs: number;
          totalPages: number;
          page: number;
          limit: number;
        };
      }>("/fornecedores?status=true", "GET", session.user.accesstoken);
      return result?.data?.docs || [];
    },
    enabled: !!session?.user?.accesstoken,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(ProdutoSchema),
    defaultValues: {
      nome_produto: "",
      descricao: "",
      preco: undefined,
      marca: "",
      // custo: undefined,
      estoque_min: undefined,
      fornecedores: "",
      codigo_produto: "",
    },
  });

  const queryClient = useQueryClient();
  const { mutate: createProduto, isPending } = useMutation({
    mutationFn: async (produto: FormData) => {
      if (!session?.user?.accesstoken) {
        throw new Error("Usuário não autenticado");
      }

      return await fetchData<any>(
        "/produtos",
        "POST",
        session.user.accesstoken,
        produto
      );
    },

    onSuccess: () => {
      toast.success("Produto cadastrado com sucesso!", {
        description: "O produto foi salvo e adicionado à lista.",
      });

      queryClient.invalidateQueries({ queryKey: ["listaProdutos"] });
      handleOpenChange(false);
      form.reset();
    },

    onError: (error: any) => {
      const errorData = error?.response?.data || error?.data || error;
      const errorMessage =
        errorData?.customMessage ||
        errorData?.message ||
        error?.message ||
        "Falha ao cadastrar produto";

      toast.error("Erro ao cadastrar produto", { description: errorMessage });
    },
  });

  const handleOpenChange = (value: boolean) => {
    // TODO: revisar o progresso do form
    // if (!value && form.formState.isDirty) {
    //   const confirmar = window.confirm(
    //     "Você tem alterações não salvas. Deseja realmente fechar?"
    //   );
    //   if (!confirmar) {
    //     return;
    //   }
    // }

    if (!isControlled) {
      setInternalOpen(value);
    }
    onOpenChange?.(value);

    if (!value) {
      form.reset();
    }
  };

  const onSubmit = (data: FormData) => {
    createProduto(data);
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
          <DialogTitle>Cadastro de produto</DialogTitle>
          <DialogDescription>
            Formulário para o cadastro de novos produtos
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 max-h-96 overflow-y-auto text-neutral-700"
            noValidate
          >
            <FormField
              control={form.control}
              name="nome_produto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do produto*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Smartphone Samsung Galaxy A55"
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
                name="fornecedores"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Fornecedor*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione um fornecedor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingFornecedores ? (
                          <SelectItem value="loading" disabled>
                            Carregando...
                          </SelectItem>
                        ) : fornecedores && fornecedores.length > 0 ? (
                          fornecedores.map((fornecedor) => (
                            <SelectItem
                              key={fornecedor._id}
                              value={fornecedor._id}
                            >
                              {fornecedor.nome_fornecedor}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="empty" disabled>
                            Nenhum fornecedor cadastrado
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-row gap-1">
              <FormField
                control={form.control}
                name="marca"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Marca*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Samsung"
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
                name="codigo_produto"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Código*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="SAM-GAL-A54-002"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                      />
                    </FormControl>
                    {/* <FormDescription className="text-[10px] flex-0">
                      O código criado deve ser único
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-row gap-1">
              <FormField
                control={form.control}
                name="estoque_min"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Estoque mínimo*</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="10"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || undefined)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preco"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Preço (R$)*</FormLabel>
                    <FormControl>
                      <NumericFormat
                        value={field.value ?? ""}
                        placeholder="R$ 1299,99"
                        thousandSeparator="."
                        decimalSeparator=","
                        fixedDecimalScale
                        allowNegative={false}
                        prefix="R$ "
                        customInput={Input}
                        onValueChange={(values) => {
                          field.onChange(values.floatValue ?? null);
                        }}
                        onFocus={(e) => e.target.select()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição*</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Smartphone Samsung Galaxy A54 128GB, Tela 6.4 polegadas, Câmera 50MP"
                      className="h-[100px] resize-none"
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
