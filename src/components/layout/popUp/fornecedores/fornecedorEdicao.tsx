"use client";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Fornecedor, ESTADOS_BRASILEIROS } from "../../../../types/Fornecedor";
import { fetchData } from "@/services/api";
import {
  FornecedorCreateSchema,
  type FornecedorInput,
} from "@/schemas/fornecedor";
import { capitalizeFirst } from "@/lib/capitalize";
import { formatarTelefone } from "@/lib/adjustPhoneNumber";
import { formatarCep } from "@/lib/adjustCep";
import { useSession } from "next-auth/react";

interface FornecedorEdicaoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fornecedor: Fornecedor | null;
}

export function FornecedorEdicao({
  open,
  onOpenChange,
  fornecedor,
}: FornecedorEdicaoProps) {
  const { data: session } = useSession();
  const [loadingCep, setLoadingCep] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm<FornecedorInput>({
    resolver: zodResolver(FornecedorCreateSchema),
    defaultValues: {
      nome_fornecedor: "",
      cnpj: "",
      telefone: "",
      email: "",
      logradouro: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
    },
  });

  const buscarCep = async (cep: string) => {
    if (!cep || cep.length < 8) return;

    setLoadingCep(true);
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
      setLoadingCep(false);
    }
  };

  const { mutate: updateFornecedor, isPending } = useMutation({
    mutationFn: async (data: any) => {
      if (!session?.user?.accesstoken) {
        throw new Error("Usuário não autenticado");
      }

      return await fetchData<any>(
        `/fornecedores/${fornecedor?._id}`,
        "PATCH",
        session.user.accesstoken,
        data
      );
    },
    onSuccess: () => {
      toast.success("Fornecedor atualizado com sucesso!", {
        description: "As alterações foram salvas.",
      });

      queryClient.invalidateQueries({ queryKey: ["listaFornecedores"] });
      onOpenChange(false);
      form.reset();
    },

    onError: (error: any) => {
      const errorData = error?.response?.data || error?.data || error;
      const errorMessage =
        errorData?.customMessage ||
        errorData?.message ||
        error?.message ||
        error?.toString() ||
        "Falha ao editar fornecedor";

      toast.error("Erro ao editar fornecedor", { description: errorMessage });
    },
  });

  useEffect(() => {
    if (fornecedor && open) {
      const enderecoPrincipal = fornecedor.endereco?.[0];

      form.reset({
        nome_fornecedor: fornecedor.nome_fornecedor || "",
        cnpj: fornecedor.cnpj || "",
        telefone: fornecedor.telefone || "",
        email: fornecedor.email || "",
        logradouro: enderecoPrincipal?.logradouro || "",
        bairro: enderecoPrincipal?.bairro || "",
        cidade: enderecoPrincipal?.cidade || "",
        estado: enderecoPrincipal?.estado || "",
        cep: enderecoPrincipal?.cep || "",
      });
    }
  }, [fornecedor, open, form]);

  const onSubmit = (data: FornecedorInput) => {
    updateFornecedor(data);
  };

  if (!fornecedor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="gap-8 max-w-2xl">
        <DialogHeader className="flex flex-col gap-4 py-2 border-b">
          <DialogTitle>Editar fornecedor</DialogTitle>
          <DialogDescription>
            Altere as informações do fornecedor selecionado
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
              render={() => (
                <FormItem>
                  <FormLabel>ID do fornecedor</FormLabel>
                  <FormControl>
                    <Input
                      readOnly={true}
                      className="bg-gray-100 text-gray-600 cursor-not-allowed border-gray-200"
                      value={fornecedor?._id || ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cnpj"
              render={() => (
                <FormItem>
                  <FormLabel>CNPJ</FormLabel>
                  <FormControl>
                    <Input
                      readOnly={true}
                      className="bg-gray-100 text-gray-600 cursor-not-allowed border-gray-200"
                      value={fornecedor?.cnpj || "-"}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nome_fornecedor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do fornecedor*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nome do fornecedor"
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
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="contato@empresa.com"
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

            <div className="flex flex-row gap-1">
              <FormField
                control={form.control}
                name="cep"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>CEP*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="00000-000"
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
                        disabled={loadingCep}
                      />
                    </FormControl>
                    {loadingCep && (
                      <div className="text-xs text-blue-600 mt-1">
                        Buscando endereço...
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bairro"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Bairro*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome do bairro"
                        {...field}
                        disabled={loadingCep}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="logradouro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logradouro*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Rua, Avenida, etc..."
                      {...field}
                      disabled={loadingCep}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-row gap-1">
              <FormField
                control={form.control}
                name="cidade"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Cidade*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome da cidade"
                        {...field}
                        disabled={loadingCep}
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={loadingCep}
                    >
                      <FormControl>
                        <SelectTrigger className="flex-1 w-2/">
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="AC">AC - Acre</SelectItem>
                        <SelectItem value="AL">AL - Alagoas</SelectItem>
                        <SelectItem value="AP">AP - Amapá</SelectItem>
                        <SelectItem value="AM">AM - Amazonas</SelectItem>
                        <SelectItem value="BA">BA - Bahia</SelectItem>
                        <SelectItem value="CE">CE - Ceará</SelectItem>
                        <SelectItem value="DF">
                          DF - Distrito Federal
                        </SelectItem>
                        <SelectItem value="ES">ES - Espírito Santo</SelectItem>
                        <SelectItem value="GO">GO - Goiás</SelectItem>
                        <SelectItem value="MA">MA - Maranhão</SelectItem>
                        <SelectItem value="MT">MT - Mato Grosso</SelectItem>
                        <SelectItem value="MS">
                          MS - Mato Grosso do Sul
                        </SelectItem>
                        <SelectItem value="MG">MG - Minas Gerais</SelectItem>
                        <SelectItem value="PA">PA - Pará</SelectItem>
                        <SelectItem value="PB">PB - Paraíba</SelectItem>
                        <SelectItem value="PR">PR - Paraná</SelectItem>
                        <SelectItem value="PE">PE - Pernambuco</SelectItem>
                        <SelectItem value="PI">PI - Piauí</SelectItem>
                        <SelectItem value="RJ">RJ - Rio de Janeiro</SelectItem>
                        <SelectItem value="RN">
                          RN - Rio Grande do Norte
                        </SelectItem>
                        <SelectItem value="RS">
                          RS - Rio Grande do Sul
                        </SelectItem>
                        <SelectItem value="RO">RO - Rondônia</SelectItem>
                        <SelectItem value="RR">RR - Roraima</SelectItem>
                        <SelectItem value="SC">SC - Santa Catarina</SelectItem>
                        <SelectItem value="SP">SP - São Paulo</SelectItem>
                        <SelectItem value="SE">SE - Sergipe</SelectItem>
                        <SelectItem value="TO">TO - Tocantins</SelectItem>
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
              className="w-1/2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 disabled:opacity-60"
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
