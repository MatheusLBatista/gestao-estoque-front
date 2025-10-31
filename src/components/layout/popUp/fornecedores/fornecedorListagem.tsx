import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Fornecedor } from "@/types/Fornecedor";
import { Pencil, Printer } from "lucide-react";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AdjustDate } from "@/lib/adjustDate";
import { Button } from "@/components/ui/button";
import { BotaoCadastrar } from "@/components/ui/cadastrarButton";

interface FornecedorListarProps {
  open: boolean;
  fornecedor: Fornecedor | null;
  onOpenChange: (value: boolean) => void;
  onEditar: (fornecedor: Fornecedor) => void;
  onCadastrar: () => void;
}

export function FornecedorListagem({
  open,
  fornecedor,
  onOpenChange,
  onEditar,
  onCadastrar,
}: FornecedorListarProps) {
  const enderecoFornecedor = fornecedor?.endereco?.[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-4">
        <DialogHeader className="flex flex-col gap-4 py-2 border-b">
          <DialogTitle>
            {fornecedor ? (
              <div className="bold text-1xl flex gap-2">
                {fornecedor.nome_fornecedor}
                <Pencil
                  className="cursor-pointer w-4 h-4 hover:text-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditar(fornecedor);
                  }}
                />
              </div>
            ) : (
              <div>Nenhum fornecedor selecionado.</div>
            )}
          </DialogTitle>
          <DialogDescription>Informações do fornecedor</DialogDescription>
        </DialogHeader>

        <div className="space-y-0.5 text-sm text-neutral-700 max-h-96 overflow-y-auto">
          {fornecedor ? (
            <>
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="id">ID do fornecedor*</FieldLabel>
                    <Input id="id" value={fornecedor._id} readOnly={true} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="nome_fornecedor">
                      Nome do fornecedor*
                    </FieldLabel>
                    <Input
                      id="nome_fornecedor"
                      value={fornecedor.nome_fornecedor}
                      readOnly={true}
                    />
                  </Field>

                  <div className="flex flex-row gap-1">
                    <Field>
                      <FieldLabel htmlFor="telefone">Telefone*</FieldLabel>
                      <Input
                        id="telefone"
                        value={fornecedor.telefone}
                        readOnly={true}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="cnpj">CNPJ*</FieldLabel>
                      <Input
                        id="cnpj"
                        autoComplete="off"
                        value={fornecedor.cnpj}
                        readOnly={true}
                      />
                    </Field>
                  </div>

                  <div className="flex flex-row gap-1">
                    <Field>
                      <FieldLabel htmlFor="logradouro">Logradouro*</FieldLabel>
                      <Input
                        id="logradouro"
                        value={enderecoFornecedor?.logradouro}
                        autoComplete="off"
                        readOnly={true}
                      />
                    </Field>
                  </div>

                  <div className="flex flex-row gap-1">
                    <Field>
                      <FieldLabel htmlFor="cep">CEP*</FieldLabel>
                      <Input
                        id="cep"
                        value={enderecoFornecedor?.cep}
                        readOnly={true}
                        autoComplete="off"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="bairro">Bairro*</FieldLabel>
                      <Input
                        id="bairro"
                        value={enderecoFornecedor?.bairro}
                        autoComplete="off"
                        readOnly={true}
                      />
                    </Field>
                  </div>

                  <div className="flex flex-row gap-1">
                    <Field>
                      <FieldLabel htmlFor="cidade">Cidade*</FieldLabel>
                      <Input
                        id="cidade"
                        value={enderecoFornecedor?.cidade}
                        autoComplete="off"
                        readOnly={true}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="estado">Estado*</FieldLabel>
                      <Input
                        id="estado"
                        value={enderecoFornecedor?.estado}
                        autoComplete="off"
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
                        value={AdjustDate(fornecedor.data_cadastro) ?? "-"}
                        readOnly={true}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="data_ultima_entrada">
                        Última entrada
                      </FieldLabel>
                      <Input
                        id="data_ultima_entrada"
                        value={
                          AdjustDate(fornecedor.data_ultima_atualizacao) ?? "-"
                        }
                        readOnly={true}
                      />
                    </Field>
                  </div>
                </FieldGroup>
              </FieldSet>
            </>
          ) : (
            <div className="text-neutral-500">
              Nenhum fornecedor selecionado.
            </div>
          )}
        </div>

        <div className="pt-2 border-t">
          <div className="flex flex-row justify-center gap-1">
            <Button
              className="w-1/2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
              onClick={() => window.print()}
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
