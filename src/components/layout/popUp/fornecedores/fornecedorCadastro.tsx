import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
import { BotaoCadastrar } from "@/components/ui/cadastrarButton";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import { fetchData } from "@/services/api";
import {
  FornecedorCreateSchema,
  type FornecedorCreateInput,
} from "@/schemas/fornecedor";

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
  const [internalOpen, setInternalOpen] = useState<boolean>(false);
  const isControlled = controlledOpen !== undefined;
  const dialogOpen = isControlled ? controlledOpen : internalOpen;

  const [formData, setFormData] = useState({
    nome_fornecedor: "",
    cnpj: "",
    telefone: "",
    email: "",
    logradouro: "",
    bairro: "",
    cep: "",
    cidade: "",
    estado: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingCep, setIsLoadingCep] = useState(false);

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
      if (
        newErrors.cnpj &&
        (newErrors.cnpj.includes("já está cadastrado") ||
          newErrors.cnpj.includes("já cadastrado") ||
          newErrors.cnpj.includes("CNPJ já está cadastrado no sistema"))
      ) {
        delete newErrors.cnpj;
      }
      if (
        newErrors.email &&
        (newErrors.email.includes("já está cadastrado") ||
          newErrors.email.includes("já cadastrado") ||
          newErrors.email.includes("Email já está cadastrado no sistema"))
      ) {
        delete newErrors.email;
      }
      return newErrors;
    });
  };

  const formatarCep = (value: string) => {
    const cep = value.replace(/\D/g, "");
    if (cep.length <= 5) {
      return cep;
    }
    return `${cep.slice(0, 5)}-${cep.slice(5, 8)}`;
  };

  const formatarCnpj = (value: string) => {
    const cnpj = value.replace(/\D/g, "");
    if (cnpj.length <= 2) return cnpj;
    if (cnpj.length <= 5) return `${cnpj.slice(0, 2)}.${cnpj.slice(2)}`;
    if (cnpj.length <= 8)
      return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5)}`;
    if (cnpj.length <= 12)
      return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(
        5,
        8
      )}/${cnpj.slice(8)}`;
    return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(
      5,
      8
    )}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`;
  };

  const formatarTelefone = (value: string) => {
    const telefone = value.replace(/\D/g, "");
    if (telefone.length <= 2) return telefone;
    if (telefone.length <= 6)
      return `(${telefone.slice(0, 2)}) ${telefone.slice(2)}`;
    if (telefone.length <= 10)
      return `(${telefone.slice(0, 2)}) ${telefone.slice(
        2,
        6
      )}-${telefone.slice(6)}`;
    return `(${telefone.slice(0, 2)}) ${telefone.slice(2, 7)}-${telefone.slice(
      7,
      11
    )}`;
  };

  const buscarCep = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) return;

    setIsLoadingCep(true);
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );
      const data = await response.json();

      if (data.erro) {
        toast.error("CEP não encontrado");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        logradouro: data.logradouro || prev.logradouro,
        bairro: data.bairro || prev.bairro,
        cidade: data.localidade || prev.cidade,
        estado: data.uf || prev.estado,
      }));

      ["logradouro", "bairro", "cidade", "estado"].forEach((field) => {
        if (
          data[
            field === "cidade"
              ? "localidade"
              : field === "estado"
              ? "uf"
              : field
          ]
        ) {
          clearFieldError(field);
        }
      });

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

      return await fetchData<any>("/fornecedores", "POST", undefined, body);
    },
    onSuccess: () => {
      toast.success("Fornecedor cadastrado com sucesso!", {
        description: "O fornecedor foi salvo e adicionado à lista.",
      });

      queryClient.invalidateQueries({ queryKey: ["listaFornecedores"] });
      handleOpenChange(false);
      setFormData({
        nome_fornecedor: "",
        cnpj: "",
        telefone: "",
        email: "",
        logradouro: "",
        bairro: "",
        cep: "",
        cidade: "",
        estado: "",
      });
      setErrors({});
    },
    onError: (error: any) => {
      console.log("Erro detalhado:", error);

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

        if (field === "cnpj") {
          setErrors({ cnpj: message });
          toast.error("CNPJ duplicado", {
            description: message,
          });
        } else if (field === "email") {
          setErrors({ email: message });
          toast.error("Email duplicado", {
            description: message,
          });
        } else {
          setErrors({ [field]: message });
          toast.error("Erro de validação", {
            description: message,
          });
        }
      } else {
        const lowerMessage = errorMessage.toLowerCase();

        if (
          lowerMessage.includes("cnpj") &&
          (lowerMessage.includes("duplicado") ||
            lowerMessage.includes("já está cadastrado") ||
            lowerMessage.includes("unique"))
        ) {
          setErrors({ cnpj: "CNPJ já cadastrado no sistema" });
          toast.error("CNPJ duplicado", {
            description: "Este CNPJ já está cadastrado no sistema",
          });
        } else if (
          lowerMessage.includes("email") &&
          (lowerMessage.includes("duplicado") ||
            lowerMessage.includes("já está cadastrado") ||
            lowerMessage.includes("unique"))
        ) {
          setErrors({ email: "Email já cadastrado no sistema" });
          toast.error("Email duplicado", {
            description: "Este email já está cadastrado no sistema",
          });
        } else if (error?.status === 400 || errorData?.statusCode === 400) {
          toast.error("Dados inválidos", {
            description: errorMessage || "Verifique os dados informados",
          });
        } else if (error?.status === 409 || errorData?.statusCode === 409) {
          toast.error("Dados duplicados", {
            description: "CNPJ ou Email já estão cadastrados no sistema",
          });
        } else {
          const message = errorMessage || "Falha ao cadastrar fornecedor";
          toast.error("Erro ao cadastrar fornecedor", { description: message });
        }
      }
    },
  });

  const handleOpenChange = (value: boolean) => {
    if (!isControlled) {
      setInternalOpen(value);
    }
    onOpenChange?.(value);
  };

  const save = () => {
    const result = FornecedorCreateSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      toast.warning("Verifique os campos obrigatórios");
      return;
    }

    setErrors({});
    createFornecedor(result.data);
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

        <FieldSet className="max-h-96 overflow-y-auto">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nome do fornecedor*</FieldLabel>
              <div className="flex flex-col">
                <Input
                  id="name"
                  autoComplete="off"
                  placeholder="Auto Peças Sul Ltda"
                  value={formData.nome_fornecedor}
                  onChange={(e) => {
                    setFormData((s) => ({
                      ...s,
                      nome_fornecedor: e.target.value,
                    }));
                    clearFieldError("nome_fornecedor");
                  }}
                />
                {errors.nome_fornecedor && (
                  <FieldError className="text-xs ml-1 mt-1">
                    {errors.nome_fornecedor}
                  </FieldError>
                )}
              </div>
            </Field>

            <div className="flex flex-row gap-1">
              <Field>
                <FieldLabel htmlFor="cnpj">CNPJ*</FieldLabel>
                <div className="flex flex-col">
                  <Input
                    id="cnpj"
                    autoComplete="off"
                    placeholder="12.345.678/0001-90"
                    value={formData.cnpj}
                    onChange={(e) => {
                      const valorFormatado = formatarCnpj(e.target.value);
                      setFormData((s) => ({ ...s, cnpj: valorFormatado }));
                      clearFieldError("cnpj");
                      clearServerErrors(); 
                    }}
                  />
                  {errors.cnpj && (
                    <FieldError className="text-xs ml-1 mt-1">
                      {errors.cnpj}
                    </FieldError>
                  )}
                </div>
              </Field>
              <Field>
                <FieldLabel htmlFor="telefone">Telefone*</FieldLabel>
                <div className="flex flex-col">
                  <Input
                    id="telefone"
                    autoComplete="off"
                    placeholder="(11) 99999-9999"
                    value={formData.telefone}
                    onChange={(e) => {
                      const valorFormatado = formatarTelefone(e.target.value);
                      setFormData((s) => ({ ...s, telefone: valorFormatado }));
                      clearFieldError("telefone");
                    }}
                  />
                  {errors.telefone && (
                    <FieldError className="text-xs ml-1 mt-1">
                      {errors.telefone}
                    </FieldError>
                  )}
                </div>
              </Field>
            </div>

            <div className="flex flex-row gap-1">
              <Field>
                <FieldLabel htmlFor="email">Email*</FieldLabel>
                <div className="flex flex-col">
                  <Input
                    id="email"
                    autoComplete="off"
                    placeholder="contato@autopecassul.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData((s) => ({ ...s, email: e.target.value }));
                      clearFieldError("email");
                      clearServerErrors(); // Limpa erros de duplicação
                    }}
                  />
                  {errors.email && (
                    <FieldError className="text-xs ml-1 mt-1">
                      {errors.email}
                    </FieldError>
                  )}
                </div>
              </Field>
            </div>

            <div className="flex flex-row gap-1">
              <Field>
                <FieldLabel htmlFor="logradouro">Logradouro*</FieldLabel>
                <div className="flex flex-col">
                  <Input
                    id="logradouro"
                    autoComplete="off"
                    placeholder="Rua Exemplo, 123"
                    value={formData.logradouro}
                    onChange={(e) => {
                      setFormData((s) => ({
                        ...s,
                        logradouro: e.target.value,
                      }));
                      clearFieldError("logradouro");
                    }}
                  />
                  {errors.logradouro && (
                    <FieldError className="text-xs ml-1 mt-1">
                      {errors.logradouro}
                    </FieldError>
                  )}
                </div>
              </Field>
            </div>

            <div className="flex flex-row gap-1">
              <Field>
                <FieldLabel htmlFor="bairro">Bairro*</FieldLabel>
                <div className="flex flex-col">
                  <Input
                    id="bairro"
                    autoComplete="off"
                    placeholder="Centro"
                    value={formData.bairro}
                    onChange={(e) => {
                      setFormData((s) => ({ ...s, bairro: e.target.value }));
                      clearFieldError("bairro");
                    }}
                  />
                  {errors.bairro && (
                    <FieldError className="text-xs ml-1 mt-1">
                      {errors.bairro}
                    </FieldError>
                  )}
                </div>
              </Field>
              <Field>
                <FieldLabel htmlFor="cep">CEP*</FieldLabel>
                <div className="flex flex-col">
                  <Input
                    id="cep"
                    autoComplete="off"
                    placeholder="00000-000"
                    value={formData.cep}
                    onChange={(e) => {
                      const valorFormatado = formatarCep(e.target.value);
                      setFormData((s) => ({ ...s, cep: valorFormatado }));
                      clearFieldError("cep");
                    }}
                    onBlur={(e) => {
                      const cep = e.target.value.replace(/\D/g, "");
                      if (cep.length === 8) {
                        buscarCep(cep);
                      }
                    }}
                    disabled={isLoadingCep}
                  />
                  {isLoadingCep && (
                    <div className="text-xs ml-1 mt-1 text-blue-600">Buscando CEP...</div>
                  )}
                  {errors.cep && (
                    <FieldError className="text-xs ml-1 mt-1">
                      {errors.cep}
                    </FieldError>
                  )}
                </div>
              </Field>
            </div>

            <div className="flex flex-row gap-1">
              <Field>
                <FieldLabel htmlFor="cidade">Cidade*</FieldLabel>
                <div className="flex flex-col">
                  <Input
                    id="cidade"
                    autoComplete="off"
                    placeholder="São Paulo"
                    value={formData.cidade}
                    onChange={(e) => {
                      setFormData((s) => ({ ...s, cidade: e.target.value }));
                      clearFieldError("cidade");
                    }}
                  />
                  {errors.cidade && (
                    <FieldError className="text-xs ml-1 mt-1">
                      {errors.cidade}
                    </FieldError>
                  )}
                </div>
              </Field>
              <Field>
                <FieldLabel htmlFor="estado">Estado*</FieldLabel>
                <div className="flex flex-col">
                  <Input
                    id="estado"
                    autoComplete="off"
                    placeholder="SP"
                    value={formData.estado}
                    onChange={(e) => {
                      setFormData((s) => ({ ...s, estado: e.target.value }));
                      clearFieldError("estado");
                    }}
                  />
                  {errors.estado && (
                    <FieldError className="text-xs ml-1 mt-1">
                      {errors.estado}
                    </FieldError>
                  )}
                </div>
              </Field>
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
