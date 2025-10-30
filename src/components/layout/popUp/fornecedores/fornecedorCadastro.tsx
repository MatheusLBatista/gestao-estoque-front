import { Fornecedor, ESTADOS_BRASILEIROS } from "@/types/Fornecedor";
import { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";

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

  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [loadingCep, setLoadingCep] = useState(false);

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
        setLogradouro(data.logradouro || "");
        setBairro(data.bairro || "");
        setCidade(data.localidade || "");
        setEstado(data.uf || "");
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

  const formatarCep = (value: string) => {
    const apenas_numeros = value.replace(/\D/g, "");
    const cep_formatado = apenas_numeros.replace(/(\d{5})(\d)/, "$1-$2");
    return cep_formatado.substring(0, 9);
  };

  const handleOpenChange = (value: boolean) => {
    if (!isControlled) {
      setInternalOpen(value);
    }
    onOpenChange?.(value);
  };

  const save = () => {
    toast.success("Fornecedor cadastrado com sucesso!", {
      description: "O fornecedor foi salvo e adicionado à lista.",
    });

    handleOpenChange(false);
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

      <DialogContent className="gap-8">
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
              <Input
                id="name"
                autoComplete="off"
                placeholder="Auto Peças Sul Ltda"
              />
            </Field>

            <div className="flex flex-row gap-1">
              <Field>
                <FieldLabel htmlFor="cnpj">CNPJ*</FieldLabel>
                <Input
                  id="cnpj"
                  autoComplete="off"
                  placeholder="12.345.678/0001-90"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="telefone">Telefone*</FieldLabel>
                <Input
                  id="telefone"
                  autoComplete="off"
                  placeholder="(11) 99999-9999"
                />
              </Field>
            </div>

            <div className="flex flex-row gap-1">
              <Field>
                <FieldLabel htmlFor="email">Email*</FieldLabel>
                <Input
                  id="email"
                  autoComplete="off"
                  placeholder="contato@autopecassul.com"
                />
              </Field>
            </div>

            <div className="flex flex-row gap-1">
              <Field>
                <FieldLabel htmlFor="logradouro">Logradouro*</FieldLabel>
                <Input
                  id="logradouro"
                  value={logradouro}
                  onChange={(e) => setLogradouro(e.target.value)}
                  autoComplete="off"
                  placeholder="Rua, Avenida, etc."
                  disabled={loadingCep}
                />
              </Field>
            </div>

            <div className="flex flex-row gap-1">
              <Field>
                <FieldLabel htmlFor="cep">CEP*</FieldLabel>
                <Input
                  id="cep"
                  value={cep}
                  onChange={(e) => {
                    const formattedCep = formatarCep(e.target.value);
                    setCep(formattedCep);

                    const cepLimpo = formattedCep.replace(/\D/g, "");
                    if (cepLimpo.length === 8) {
                      buscarCep(formattedCep);
                    }
                  }}
                  autoComplete="off"
                  placeholder="12345-678"
                  disabled={loadingCep}
                />
                {loadingCep && (
                  <FieldDescription>Buscando endereço...</FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="bairro">Bairro*</FieldLabel>
                <Input
                  id="bairro"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  autoComplete="off"
                  placeholder="Nome do bairro"
                  disabled={loadingCep}
                />
              </Field>
            </div>

            <div className="flex flex-row gap-1">
              <Field>
                <FieldLabel htmlFor="cidade">Cidade*</FieldLabel>
                <Input
                  id="cidade"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  autoComplete="off"
                  placeholder="Nome da cidade"
                  disabled={loadingCep}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="estado">Estado*</FieldLabel>
                <Select
                  value={estado}
                  onValueChange={setEstado}
                  disabled={loadingCep}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS_BRASILEIROS.map((est) => (
                      <SelectItem key={est.value} value={est.value}>
                        {est.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>
        <div className="flex flex-row gap-2 justify-end">
          <Button
            onClick={() => handleOpenChange(false)}
            className="cursor-pointer text-black bg-transparent border hover:bg-neutral-50"
            data-slot="dialog-close"
          >
            Cancelar
          </Button>
          <Button
            onClick={save}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-1" /> Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
