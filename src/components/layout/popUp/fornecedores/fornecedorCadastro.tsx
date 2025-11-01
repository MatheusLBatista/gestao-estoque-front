import { Fornecedor } from "@/types/Fornecedor";
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
                  autoComplete="off"
                  placeholder="12.345.678/0001-90"
                />
              </Field>
            </div>

            <div className="flex flex-row gap-1">
              <Field>
                <FieldLabel htmlFor="bairro">Bairro*</FieldLabel>
                <Input
                  id="bairro"
                  autoComplete="off"
                  placeholder="12.345.678/0001-90"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="cep">CEP*</FieldLabel>
                <Input
                  id="cep"
                  autoComplete="off"
                  placeholder="(11) 99999-9999"
                />
              </Field>
            </div>

            <div className="flex flex-row gap-1">
              <Field>
                <FieldLabel htmlFor="cidade">Cidade*</FieldLabel>
                <Input
                  id="cidade"
                  autoComplete="off"
                  placeholder="12.345.678/0001-90"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="estado">Estado*</FieldLabel>
                <Input
                  id="estado"
                  autoComplete="off"
                  placeholder="(11) 99999-9999"
                />
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
