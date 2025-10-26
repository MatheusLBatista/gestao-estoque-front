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
import { Produto } from "../../../../types/Produto";
import { AdjustPrice } from "@/lib/adjustPrice";

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
    id_fornecedor: "",
    marca: "",
    codigo_produto: "",
    descricao: "",
    custo: "",
    preco: "",
    estoque: "",
    estoque_min: "",
    categoria: "",
  });

  useEffect(() => {
    if (produto) {
      setFormData({
        nome_produto: produto.nome_produto || "",
        id_fornecedor: produto.fornecedores._id || "",
        marca: produto.marca || "",
        codigo_produto: produto.codigo_produto || "",
        descricao: produto.descricao || "",
        custo: produto.custo ? produto.custo.toString() : "",
        preco: produto.preco ? produto.preco.toString() : "",
        estoque: produto.estoque ? produto.estoque.toString() : "",
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

        <FieldSet className="max-h-96 overflow-y-auto">
          <FieldGroup>
            <Field>
              <FieldLabel>Nome do produto*</FieldLabel>
              <Input
                readOnly={true}
                className="bg-gray-100 text-gray-600 cursor-not-allowed border-gray-200"
                value={formData.nome_produto}
                onChange={(e) =>
                  handleInputChange("nome_produto", e.target.value)
                }
              />
            </Field>

            <div className="flex flex-row gap-1">
              <Field>
                <FieldLabel>ID do fornecedor*</FieldLabel>
                <Input
                  readOnly={true}
                  className="bg-gray-100 text-gray-600 cursor-not-allowed border-gray-200"
                  value={formData.id_fornecedor || "Sem fornecedor"}
                  onChange={(e) =>
                    handleInputChange("id_fornecedor", e.target.value)
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="categoria">Categoria*</FieldLabel>
                <Input
                  readOnly={false}
                  className="bg-gray-100 text-gray-600 cursor-not-allowed border-gray-200"
                  id="categoria"
                  autoComplete="off"
                  value={String(formData.categoria ?? "")}
                  onChange={(e) =>
                    handleInputChange("categoria", e.target.value)
                  }
                />
              </Field>
            </div>

            <div className="flex flex-row gap-1">
              <Field>
                <FieldLabel>Estoque*</FieldLabel>
                <Input
                  readOnly={true}
                  className="bg-gray-100 text-gray-600 cursor-not-allowed border-gray-200"
                  value={formData.estoque ?? "-"}
                  onChange={(e) => handleInputChange("estoque", e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="estoque_min">Estoque mínimo*</FieldLabel>
                <Input
                  readOnly={false}
                  className="bg-white border-gray-300 cursor-text hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  id="estoque_min"
                  type="number"
                  autoComplete="off"
                  value={formData.estoque_min}
                  onChange={(e) =>
                    handleInputChange("estoque_min", e.target.value)
                  }
                />
              </Field>
            </div>

            <div className="flex flex-row gap-1">
              <Field>
                <FieldLabel htmlFor="marca">Marca*</FieldLabel>
                <Input
                  readOnly={false}
                  className="bg-gray-100 text-gray-600 cursor-not-allowed border-gray-200"
                  id="marca"
                  autoComplete="off"
                  value={formData.marca ?? ""}
                  onChange={(e) => handleInputChange("marca", e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="codigo">Código*</FieldLabel>
                <Input
                  readOnly={false}
                  className="bg-gray-100 text-gray-600 cursor-not-allowed border-gray-200"
                  id="codigo"
                  autoComplete="off"
                  value={formData.codigo_produto ?? ""}
                  onChange={(e) =>
                    handleInputChange("codigo_produto", e.target.value)
                  }
                />
              </Field>
            </div>

            <div>
              <Field>
                <FieldLabel htmlFor="descricao">Descrição</FieldLabel>
                <Textarea
                  className="h-[60px] bg-white border-gray-300 cursor-text hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  id="descricao"
                  autoComplete="off"
                  value={formData.descricao ?? ""}
                  onChange={(e) =>
                    handleInputChange("descricao", e.target.value)
                  }
                />
              </Field>
            </div>
            <div className="flex flex-row gap-1">
              <Field>
                <FieldLabel htmlFor="preco">Preço</FieldLabel>
                <Input
                  readOnly={false}
                  className="bg-white border-gray-300 cursor-text hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  id="preco"
                  type="number"
                  step="0.01"
                  value={formData.preco}
                  onChange={(e) => handleInputChange("preco", e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="custo">Custo</FieldLabel>
                <Input
                  readOnly={true}
                  className="bg-gray-100 text-gray-600 cursor-not-allowed border-gray-200"
                  id="custo"
                  value={AdjustPrice(formData.custo) || ""}
                  onChange={(e) => handleInputChange("custo", e.target.value)}
                />
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>

        <div className="pt-4 border-t">
          <div className="flex flex-row justify-center gap-1">
            <Button
              onClick={() => onOpenChange(false)}
              className="w-1/2 cursor-pointer text-black bg-transparent border hover:bg-neutral-50 flex items-center gap-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={save}
              className="w-1/2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
            >
              <Save className="w-4 h-4" /> Salvar alterações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
