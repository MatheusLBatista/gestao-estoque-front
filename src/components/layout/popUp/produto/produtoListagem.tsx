import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Produto } from "@/types/Produto";
import { Pencil, Printer } from "lucide-react";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdjustPrice } from "@/lib/adjustPrice";
import { AdjustDate } from "@/lib/adjustDate";
import { Button } from "@/components/ui/button";
import { BotaoCadastrar } from "@/components/ui/cadastrarButton";
import { toast } from "sonner";
import {
  useRecordPrint,
  createAvailabilityBadge,
} from "@/components/layout/print/RecordPrint";

interface ProdutoListarProps {
  open: boolean;
  produto: Produto | null;
  onOpenChange: (value: boolean) => void;
  onEditar: (produto: Produto) => void;
  onCadastrar: () => void;
}

export function ProdutoListagem({
  open,
  produto,
  onOpenChange,
  onEditar,
  onCadastrar,
}: ProdutoListarProps) {
  const { printRecord } = useRecordPrint();

  const handlePrintProduto = () => {
    if (!produto) {
      toast.error("Nenhum produto selecionado para impressão");
      return;
    }

    const sections = [
      {
        title: "Informações Básicas",
        fields: [
          { label: "ID do Produto", value: produto._id },
          { label: "Nome do Produto", value: produto.nome_produto || "-" },
          { label: "Código do Produto", value: produto.codigo_produto || "-" },
          { label: "Descrição", value: produto.descricao || "-" },
          { label: "Marca", value: produto.marca || "-" },
          { label: "Categoria", value: produto.categoria || "-" },
        ],
      },
      {
        title: "Estoque e Preços",
        fields: [
          {
            label: "Quantidade em Estoque",
            value: produto.estoque?.toString() || "0",
          },
          {
            label: "Estoque Mínimo",
            value: produto.estoque_min?.toString() || "0",
          },
          { label: "Preço de Custo", value: AdjustPrice(produto.custo) },
          {
            label: "Preço de Venda",
            value: produto.preco ? AdjustPrice(produto.preco) : "-",
          },
          {
            label: "Fornecedor",
            value: produto.fornecedores?.nome_fornecedor || "-",
          },
        ],
      },
      {
        title: "Informações de Sistema",
        fields: [
          {
            label: "Data de Cadastro",
            value: AdjustDate(produto.data_cadastro),
          },
          {
            label: "Última Entrada",
            value: AdjustDate(produto.data_ultima_atualizacao),
          },
        ],
      },
    ];

    printRecord({
      title: "Detalhes do Produto",
      recordId: produto.nome_produto,
      sections,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="gap-4">
        <DialogHeader className="flex flex-col gap-4 py-2 border-b">
          <DialogTitle>
            {produto ? (
              <div className="bold text-1xl flex gap-2">
                {produto.nome_produto}
                <Pencil
                  className="cursor-pointer w-4 h-4 hover:text-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditar(produto);
                  }}
                />
              </div>
            ) : (
              <div>Nenhum produto selecionado.</div>
            )}
          </DialogTitle>
          <DialogDescription>Informações do produto</DialogDescription>
        </DialogHeader>

        <div className="space-y-0.5 text-sm text-neutral-700 max-h-96 overflow-y-auto">
          {produto ? (
            <>
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Nome do produto*</FieldLabel>
                    <Input value={produto.nome_produto} readOnly={true} />
                  </Field>

                  <div className="flex flex-row gap-1">
                    <Field>
                      <FieldLabel>Nome do fornecedor*</FieldLabel>
                      <Input
                        value={
                          produto.fornecedores?.nome_fornecedor ||
                          "Sem fornecedor"
                        }
                        readOnly={true}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="categoria">Categoria*</FieldLabel>
                      <Input
                        id="categoria"
                        autoComplete="off"
                        value={String(produto.categoria ?? "-")}
                        readOnly={true}
                      />
                    </Field>
                  </div>

                  <div className="flex flex-row gap-1">
                    <Field>
                      <FieldLabel>Estoque*</FieldLabel>
                      <Input value={produto.estoque ?? "-"} readOnly={true} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="estoque">Estoque mínimo*</FieldLabel>
                      <Input
                        id="estoque"
                        autoComplete="off"
                        value={String(produto.estoque_min ?? "-")}
                        readOnly={true}
                      />
                    </Field>
                  </div>

                  <div className="flex flex-row gap-1">
                    <Field>
                      <FieldLabel htmlFor="marca">Marca*</FieldLabel>
                      <Input
                        id="marca"
                        autoComplete="off"
                        value={produto.marca ?? "-"}
                        readOnly={true}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="codigo">Código*</FieldLabel>
                      <Input
                        id="codigo"
                        autoComplete="off"
                        value={produto.codigo_produto ?? "-"}
                        readOnly={true}
                      />
                    </Field>
                  </div>

                  <div>
                    <Field>
                      <FieldLabel htmlFor="descricao">Descrição</FieldLabel>
                      <Textarea
                        className="h-[30px]"
                        id="descricao"
                        autoComplete="off"
                        value={produto.descricao ?? ""}
                        readOnly={true}
                      />
                    </Field>
                  </div>
                  <div className="flex flex-row gap-1">
                    <Field>
                      <FieldLabel htmlFor="preco">Preço</FieldLabel>
                      <Input
                        id="preco"
                        value={
                          produto.preco !== undefined
                            ? `${AdjustPrice(produto.preco)}`
                            : "-"
                        }
                        readOnly={true}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="custo">Custo</FieldLabel>
                      <Input
                        id="custo"
                        value={
                          typeof produto.custo === "number"
                            ? `${AdjustPrice(produto.custo)}`
                            : "-"
                        }
                        readOnly={true}
                      />
                    </Field>
                  </div>

                  <div className="flex flex-row gap-1">
                    <Field>
                      <FieldLabel htmlFor="data_cadastro">
                        Data de cadastro
                      </FieldLabel>
                      <Input
                        id="data_cadastro"
                        value={AdjustDate(produto.data_cadastro) ?? "-"}
                        readOnly={true}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="data_ultima_atualizacao">
                        Data última atualização
                      </FieldLabel>
                      <Input
                        id="data_ultima_atualizacao"
                        value={AdjustDate(produto.data_ultima_atualizacao) ?? "-"}
                        readOnly={true}
                      />
                    </Field>
                  </div>
                </FieldGroup>
              </FieldSet>
            </>
          ) : (
            <div className="text-neutral-500">Nenhum produto selecionado.</div>
          )}
        </div>

        <div className="pt-2 border-t">
          <div className="flex flex-row justify-center gap-1">
            <Button
              className="w-1/2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
              onClick={handlePrintProduto}
            >
              <Printer className="w-4 h-4" /> Imprimir
            </Button>
            <BotaoCadastrar
              color="blue"
              size="1/2"
              onClick={() => onCadastrar()}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
