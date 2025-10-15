"use client";
import { useState } from "react";
import { Bot, Package, Save } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BotaoCadastrar } from "@/components/ui/cadastrarButton";

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
    toast.success("Produto cadastrado com sucesso!", {
      description: "O produto foi salvo e adicionado à lista.",
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
          <DialogTitle>Cadastro de produto</DialogTitle>
          <DialogDescription>
            Formulário para o cadastro de novos produtos
          </DialogDescription>
        </DialogHeader>

        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nome do produto*</FieldLabel>
              <Input
                id="name"
                autoComplete="off"
                placeholder="Mola Siena 1.4 2014"
              />
            </Field>

            <div className="flex flex-row gap-1">
              <Field>
                <FieldLabel htmlFor="fornecedor">ID do fornecedor*</FieldLabel>
                <Input
                  id="fornecedor"
                  autoComplete="off"
                  placeholder="589665443210abcdef12345678"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="estoque">Estoque mínimo*</FieldLabel>
                <Input id="estoque" autoComplete="off" placeholder="10" />
              </Field>
            </div>

            {/*
            <div className="flex flex-row gap-1">
              <Field>
                <FieldLabel htmlFor="marca">Custo*</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupText>R$</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput placeholder="19,99" />
                </InputGroup>
              </Field>

              <Field>
                <FieldLabel htmlFor="codigo">Preço*</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupText>R$</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput placeholder="19,99" />
                </InputGroup>
              </Field>
            </div>
             */}

            <div className="flex flex-row gap-1">
              <Field>
                <FieldLabel htmlFor="marca">Marca*</FieldLabel>
                <Input id="marca" autoComplete="off" placeholder="FIAT" />
              </Field>
              <Field>
                <FieldLabel htmlFor="codigo">Código*</FieldLabel>
                <Input id="codigo" autoComplete="off" placeholder="ABC-1212" />
                <FieldDescription className="text-[10px] mx-2 my-0">
                  O código criado deve ser único
                </FieldDescription>
              </Field>
            </div>

            <div>
              <Field>
                <FieldLabel htmlFor="descricao">Descrição</FieldLabel>
                <Textarea
                  className="h-[120px]"
                  id="descricao"
                  autoComplete="off"
                  placeholder="Produto utilizado para abastecer carros da marca FIAT."
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
