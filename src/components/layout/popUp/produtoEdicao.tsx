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
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Produto } from "../../../lib/Produto";

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
  const [formData, setFormData] = useState({
    nome_produto: "",
    marca: "",
    codigo_produto: "",
    descricao: "",
    custo: "",
    preco: "",
    estoque_min: "",
    categoria: "",
  });

  useEffect(() => {
    if (produto) {
      setFormData({
        nome_produto: produto.nome_produto || "",
        marca: produto.marca || "",
        codigo_produto: produto.codigo_produto || "",
        descricao: produto.descricao || "",
        custo: produto.custo ? produto.custo.toString() : "",
        preco: produto.preco ? produto.preco.toString() : "",
        estoque_min: produto.estoque_min ? produto.estoque_min.toString() : "",
        categoria: produto.categoria || "",
      });
    }
  }, [produto]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const save = () => {
    // TODO: Implementar chamada da API para atualizar o produto
    console.log("Dados para salvar:", formData);

    toast.success("Produto atualizado com sucesso!", {
      description: "As alterações foram salvas.",
    });

    onOpenChange(false);
  };

  if (!produto) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-8 max-w-2xl">
        <DialogHeader className="flex flex-col gap-4 py-2 border-b">
          <DialogTitle>Editar produto</DialogTitle>
          <DialogDescription>
            Altere as informações do produto selecionado
          </DialogDescription>
        </DialogHeader>

        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="edit_nome">Nome do produto*</FieldLabel>
              <Input
                id="edit_nome"
                value={formData.nome_produto}
                onChange={(e) =>
                  handleInputChange("nome_produto", e.target.value)
                }
                placeholder="Digite o nome do produto"
              />
            </Field>

            <div className="flex flex-row gap-2">
              <Field>
                <FieldLabel htmlFor="edit_marca">Marca*</FieldLabel>
                <Input
                  id="edit_marca"
                  value={formData.marca}
                  onChange={(e) => handleInputChange("marca", e.target.value)}
                  placeholder="Digite a marca"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="edit_codigo">Código*</FieldLabel>
                <Input
                  id="edit_codigo"
                  value={formData.codigo_produto}
                  onChange={(e) =>
                    handleInputChange("codigo_produto", e.target.value)
                  }
                  placeholder="Digite o código"
                />
                <FieldDescription className="text-[10px] mx-2 my-0">
                  O código deve ser único
                </FieldDescription>
              </Field>
            </div>

            <div className="flex flex-row gap-2">
              <Field>
                <FieldLabel htmlFor="edit_custo">Custo*</FieldLabel>
                <Input
                  id="edit_custo"
                  value={formData.custo}
                  onChange={(e) => handleInputChange("custo", e.target.value)}
                  placeholder="0,00"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="edit_preco">Preço</FieldLabel>
                <Input
                  id="edit_preco"
                  value={formData.preco}
                  onChange={(e) => handleInputChange("preco", e.target.value)}
                  placeholder="0,00"
                />
              </Field>
            </div>

            <div className="flex flex-row gap-2">
              <Field>
                <FieldLabel htmlFor="edit_categoria">Categoria*</FieldLabel>
                <Input
                  id="edit_categoria"
                  value={formData.categoria}
                  onChange={(e) =>
                    handleInputChange("categoria", e.target.value)
                  }
                  placeholder="Digite a categoria"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="edit_estoque_min">
                  Estoque mínimo*
                </FieldLabel>
                <Input
                  id="edit_estoque_min"
                  value={formData.estoque_min}
                  onChange={(e) =>
                    handleInputChange("estoque_min", e.target.value)
                  }
                  placeholder="0"
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="edit_descricao">Descrição</FieldLabel>
              <Textarea
                className="h-[120px]"
                id="edit_descricao"
                value={formData.descricao}
                onChange={(e) => handleInputChange("descricao", e.target.value)}
                placeholder="Digite a descrição do produto"
              />
            </Field>

            {/* Campos somente leitura para referência */}
            <div className="border-t pt-4 mt-4">
              <h4 className="text-sm font-medium text-neutral-600 mb-3">
                Informações não editáveis
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-neutral-500">
                <div>
                  <span className="font-medium">Fornecedor:</span>{" "}
                  {produto.fornecedores?.nome_fornecedor || "Não informado"}
                </div>
                <div>
                  <span className="font-medium">Estoque atual:</span>{" "}
                  {produto.estoque}
                </div>
              </div>
            </div>
          </FieldGroup>
        </FieldSet>

        <div className="flex flex-row gap-2 justify-end">
          <Button
            onClick={() => onOpenChange(false)}
            className="cursor-pointer text-black bg-transparent border hover:bg-neutral-50"
          >
            Cancelar
          </Button>
          <Button
            onClick={save}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-1" /> Salvar alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
