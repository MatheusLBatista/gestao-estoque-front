"use client";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
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
import { FornecedorCreateSchema } from "@/schemas/fornecedor";
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
  const [formData, setFormData] = useState({
    nome_fornecedor: "",
    telefone: "",
    email: "",
    status: true,
    logradouro: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
  });
  const { data: session } = useSession();

  const [loadingCep, setLoadingCep] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: updateFornecedor, isPending } = useMutation({
    mutationFn: async (payload: any) => {
      if (!fornecedor?._id) {
        throw new Error("ID do fornecedor não encontrado");
      }

      const body = {
        nome_fornecedor: payload.nome_fornecedor,
        telefone: payload.telefone,
        email: payload.email,
        status: payload.status,
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

      if(!session || !session.user.accesstoken) {
        throw new Error("Usuário não autenticado");
      }

      return await fetchData<any>(
        `/fornecedores/${fornecedor._id}`,
        "PATCH",
        session.user.accesstoken,
        body
      );
    },
    onSuccess: () => {
      toast.success("Fornecedor atualizado com sucesso!", {
        description: "As alterações foram salvas.",
      });

      queryClient.invalidateQueries({ queryKey: ["listaFornecedores"] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      console.log("Erro ao atualizar fornecedor:", error);

      const errorData = error?.response?.data || error?.data || error;
      const errorMessage =
        errorData?.customMessage ||
        errorData?.message ||
        error?.message ||
        error?.toString() ||
        "";

      if (errorData?.errorType === "validationError" && errorData?.field) {
        const field = errorData.field;
        const message = errorData.customMessage || `${field} inválido`;

        if (field === "email") {
          toast.error("Email duplicado", {
            description: message,
          });
        } else {
          toast.error("Erro de validação", {
            description: message,
          });
        }
      } else {
        const message = errorMessage || "Falha ao atualizar fornecedor";
        toast.error("Erro ao atualizar fornecedor", { description: message });
      }
    },
  });

  const buscarCep = async (cepValue: string) => {
    const cepLimpo = cepValue.replace(/\D/g, "");

    if (cepLimpo.length !== 8) return;

    setLoadingCep(true);
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );
      const data = await response.json();

      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          logradouro: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          estado: data.uf || "",
        }));
        toast.success("CEP encontrado com sucesso!");
      } else {
        toast.error("CEP não encontrado");
      }
    } catch (error) {
      toast.error("Erro ao buscar CEP");
    } finally {
      setLoadingCep(false);
    }
  };

  useEffect(() => {
    if (fornecedor) {
      const enderecoPrincipal = fornecedor.endereco?.[0];

      setFormData({
        nome_fornecedor: fornecedor.nome_fornecedor || "",
        telefone: fornecedor.telefone || "",
        email: fornecedor.email || "",
        status: fornecedor.status ?? true,
        logradouro: enderecoPrincipal?.logradouro || "",
        bairro: enderecoPrincipal?.bairro || "",
        cidade: enderecoPrincipal?.cidade || "",
        estado: enderecoPrincipal?.estado || "",
        cep: enderecoPrincipal?.cep || "",
      });
    }
  }, [fornecedor]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatTelefone = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  };

  const formatCEP = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    return cleaned.replace(/(\d{5})(\d{3})/, "$1-$2");
  };

  const save = () => {
    const validationData = {
      nome_fornecedor: formData.nome_fornecedor,
      cnpj: fornecedor?.cnpj || "",
      telefone: formData.telefone,
      email: formData.email,
      logradouro: formData.logradouro,
      bairro: formData.bairro,
      cep: formData.cep,
      cidade: formData.cidade,
      estado: formData.estado,
    };

    const result = FornecedorCreateSchema.safeParse(validationData);

    if (!result.success) {
      // Pega o primeiro erro para exibir
      const firstError = result.error.issues[0];
      const fieldName = String(firstError.path[0]);
      const message = firstError.message;

      toast.warning(`Erro no campo ${fieldName}: ${message}`);
      return;
    }

    // Chama a mutation para atualizar (sem incluir CNPJ que não pode ser alterado)
    updateFornecedor(formData);
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

        <FieldSet className="max-h-96 overflow-y-auto">
          <FieldGroup>
            <Field>
              <FieldLabel>ID do fornecedor</FieldLabel>
              <Input
                readOnly={true}
                className="bg-gray-100 text-gray-600 cursor-not-allowed border-gray-200"
                value={fornecedor._id}
              />
            </Field>

            <Field>
              <FieldLabel>CNPJ</FieldLabel>
              <Input
                readOnly={true}
                className="bg-gray-100 text-gray-600 cursor-not-allowed border-gray-200"
                value={fornecedor.cnpj || "-"}
              />
            </Field>

            <Field>
              <FieldLabel>Nome do fornecedor*</FieldLabel>
              <Input
                readOnly={false}
                className="bg-white border-gray-300 cursor-text hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={formData.nome_fornecedor}
                onChange={(e) =>
                  handleInputChange("nome_fornecedor", e.target.value)
                }
                placeholder="Nome do fornecedor"
                required
              />
            </Field>

            <div className="flex flex-row gap-1">
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  readOnly={false}
                  className="bg-white border-gray-300 cursor-text hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="contato@empresa.com"
                />
              </Field>
            </div>

            <div className="flex flex-row gap-1">
              <Field>
                <FieldLabel>Telefone*</FieldLabel>
                <Input
                  readOnly={false}
                  className="bg-white border-gray-300 cursor-text hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={formData.telefone}
                  onChange={(e) => {
                    const formatted = formatTelefone(e.target.value);
                    if (formatted.length <= 15) {
                      handleInputChange("telefone", formatted);
                    }
                  }}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                  required
                />
              </Field>

              <Field>
                <FieldLabel>CEP*</FieldLabel>
                <Input
                  readOnly={false}
                  className="bg-white border-gray-300 cursor-text hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={formData.cep}
                  onChange={(e) => {
                    const formatted = formatCEP(e.target.value);
                    if (formatted.length <= 9) {
                      handleInputChange("cep", formatted);

                      const cepLimpo = formatted.replace(/\D/g, "");
                      if (cepLimpo.length === 8) {
                        buscarCep(formatted);
                      }
                    }
                  }}
                  placeholder="00000-000"
                  maxLength={9}
                  disabled={loadingCep}
                  required
                />
                {loadingCep && (
                  <div className="text-xs text-blue-600 mt-1">
                    Buscando endereço...
                  </div>
                )}
              </Field>
            </div>

            <Field>
              <FieldLabel>Logradouro*</FieldLabel>
              <Input
                readOnly={false}
                className="bg-white border-gray-300 cursor-text hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={formData.logradouro}
                onChange={(e) =>
                  handleInputChange("logradouro", e.target.value)
                }
                placeholder="Rua, Avenida, etc..."
                disabled={loadingCep}
                required
              />
            </Field>

            <div className="flex flex-row gap-1">
              <Field>
                <FieldLabel>Bairro*</FieldLabel>
                <Input
                  readOnly={false}
                  className="bg-white border-gray-300 cursor-text hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={formData.bairro}
                  onChange={(e) => handleInputChange("bairro", e.target.value)}
                  placeholder="Nome do bairro"
                  disabled={loadingCep}
                  required
                />
              </Field>

              <Field>
                <FieldLabel>Cidade*</FieldLabel>
                <Input
                  readOnly={false}
                  className="bg-white border-gray-300 cursor-text hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={formData.cidade}
                  onChange={(e) => handleInputChange("cidade", e.target.value)}
                  placeholder="Nome da cidade"
                  disabled={loadingCep}
                  required
                />
              </Field>
            </div>

            <Field>
              <FieldLabel>Estado*</FieldLabel>
              <Select
                value={formData.estado}
                onValueChange={(value) => handleInputChange("estado", value)}
                disabled={loadingCep}
              >
                <SelectTrigger className="bg-white border-gray-300 cursor-pointer hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS_BRASILEIROS.map((estado) => (
                    <SelectItem key={estado.value} value={estado.value}>
                      {estado.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </FieldSet>

        <div className="pt-2 border-t">
          <div className="flex flex-row justify-center gap-1">
            <Button
              onClick={() => onOpenChange(false)}
              className="w-1/2 cursor-pointer text-black bg-transparent border hover:bg-neutral-50 flex items-center gap-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={save}
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
