"use client";
import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Produto } from "../../../../types/Produto";
import { AdjustPrice } from "@/lib/adjustPrice";
import { useSession } from "next-auth/react";
import { ProdutoSchema, type FormData } from "@/schemas/produto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "@/services/api";
import { NumericFormat } from "react-number-format";
import { capitalizeFirst } from "@/lib/capitalize";

interface ProdutoEdicaoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  produto: Produto | null;
}

export function ProdutoEdicao({
  open,
  onOpenChange,
  produto,
}: ProdutoEdicaoProps) {
  const { data: session } = useSession();

  const form = useForm<FormData>({
    resolver: zodResolver(ProdutoSchema),
    defaultValues: {
      nome_produto: produto?.nome_produto || "",
      descricao: produto?.descricao || "",
      preco: produto?.preco || 0,
      marca: produto?.marca || "",
      custo: produto?.custo || 0,
      estoque_min: produto?.estoque_min || 0,
      fornecedores: produto?.fornecedores?._id || "",
      codigo_produto: produto?.codigo_produto || "",
    },
  });

  const queryClient = useQueryClient();

  const { mutate: updateProduto, isPending } = useMutation({
    mutationFn: async (data: any) => {
      if (!session?.user?.accesstoken) {
        throw new Error("Usuário não autenticado");
      }

      return await fetchData<any>(
        `/produtos/${produto?._id}`,
        "PATCH",
        session.user.accesstoken,
        data
      );
    },
    onSuccess: () => {
      toast.success("Produto editado com sucesso!", {
        description: "O produto foi salvo e retornado à lista.",
      });

      queryClient.invalidateQueries({ queryKey: ["listaProdutos"] });
      onOpenChange(false);
      form.reset();
    },

    onError: (error: any) => {
      const errorData = error?.response?.data || error?.data || error;
      const errorMessage =
        errorData?.customMessage ||
        errorData?.message ||
        error?.message ||
        "Falha ao editar produto";

      toast.error("Erro ao editar produto", { description: errorMessage });
    },
  });

  useEffect(() => {
    if (produto && open) {
      form.reset({
        nome_produto: produto.nome_produto || "",
        descricao: produto.descricao || "",
        preco: produto.preco || undefined,
        marca: produto.marca || "",
        custo: produto.custo || undefined,
        estoque_min: produto.estoque_min || undefined,
        fornecedores: produto.fornecedores?._id || "",
        codigo_produto: produto.codigo_produto || "",
      });
    }
  }, [produto, open, form]);

  const onSubmit = (data: FormData) => {
    const updateData = {
      preco: data.preco,
      descricao: data.descricao,
      estoque_min: data.estoque_min,
    };
    updateProduto(updateData as any);
  };

  if (!produto) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="gap-8 max-w-2xl">
        <DialogHeader className="flex flex-col gap-4 py-2 border-b">
          <DialogTitle>Editar produto</DialogTitle>
          <DialogDescription>
            Altere as informações do produto selecionado
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
                      className="bg-gray-100 cursor-not-allowed"
                      readOnly
                      value={produto?.nome_produto || ""}
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
                    <FormControl>
                      <Input
                        className="bg-gray-100 cursor-not-allowed"
                        readOnly
                        value={
                          produto?.fornecedores?.nome_fornecedor ||
                          "Sem fornecedor"
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="custo"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Custo*</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-100 cursor-not-allowed"
                        readOnly
                        value={AdjustPrice(produto?.custo || 0)}
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
                name="marca"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Marca*</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-100 cursor-not-allowed"
                        readOnly
                        value={produto?.marca || ""}
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
                        className="bg-gray-100 cursor-not-allowed"
                        readOnly
                        value={produto?.codigo_produto}
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
                name="estoque_min"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Estoque mínimo*</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="10"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : ""
                          )
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

        <div className="pt-4 border-t">
          <div className="flex flex-row justify-center gap-1">
            <Button
              onClick={() => onOpenChange(false)}
              className="w-1/2 cursor-pointer text-black bg-transparent border hover:bg-neutral-50 flex items-center gap-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isPending}
              className="w-1/2 cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white flex items-center gap-1"
            >
              <Save className="w-4 h-4" />
              {isPending ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
