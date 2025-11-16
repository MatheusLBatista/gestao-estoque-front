import { z } from "zod";

const cnpjRegex = /^(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|\d{14})$/;
const telefoneRegex = /^(\(\d{2}\)\s?\d{4,5}-\d{4}|\d{10,11})$/;
const cepRegex = /^(\d{5}-\d{3}|\d{8})$/;
const estados = [
  { uf: "AC", nome: "Acre" },
  { uf: "AL", nome: "Alagoas" },
  { uf: "AP", nome: "Amapá" },
  { uf: "AM", nome: "Amazonas" },
  { uf: "BA", nome: "Bahia" },
  { uf: "CE", nome: "Ceará" },
  { uf: "DF", nome: "Distrito Federal" },
  { uf: "ES", nome: "Espirito Santo" },
  { uf: "GO", nome: "Goiás" },
  { uf: "MA", nome: "Maranhão" },
  { uf: "MS", nome: "Mato Grosso do Sul" },
  { uf: "MT", nome: "Mato Grosso" },
  { uf: "MG", nome: "Minas Gerais" },
  { uf: "PA", nome: "Pará" },
  { uf: "PB", nome: "Paraíba" },
  { uf: "PR", nome: "Paraná" },
  { uf: "PE", nome: "Pernambuco" },
  { uf: "PI", nome: "Piauí" },
  { uf: "RJ", nome: "Rio de Janeiro" },
  { uf: "RN", nome: "Rio Grande do Norte" },
  { uf: "RS", nome: "Rio Grande do Sul" },
  { uf: "RO", nome: "Rondônia" },
  { uf: "RR", nome: "Roraima" },
  { uf: "SC", nome: "Santa Catarina" },
  { uf: "SP", nome: "São Paulo" },
  { uf: "SE", nome: "Sergipe" },
  { uf: "TO", nome: "Tocantins" },
];

export const FornecedorCreateSchema = z.object({
  nome_fornecedor: z
    .string({ message: "Nome é obrigatório" })
    .trim()
    .min(2, "Informe pelo menos 2 caracteres"),
  cnpj: z
    .string({ message: "CNPJ é obrigatório" })
    .trim()
    .regex(cnpjRegex, "CNPJ inválido"),
  telefone: z
    .string({ message: "Telefone é obrigatório" })
    .trim()
    .regex(telefoneRegex, "Telefone inválido"),
  email: z
    .string({ message: "Email é obrigatório" })
    .trim()
    .email("Email inválido"),
  logradouro: z
    .string({ message: "Logradouro é obrigatório" })
    .trim()
    .min(3, "Logradouro inválido"),
  bairro: z
    .string({ message: "Bairro é obrigatório" })
    .trim()
    .min(2, "Bairro inválido"),
  cep: z
    .string({ message: "CEP é obrigatório" })
    .trim()
    .regex(cepRegex, "CEP inválido"),
  cidade: z
    .string({ message: "Cidade é obrigatória" })
    .trim()
    .min(2, "Cidade inválida"),
  estado: z
    .string()
    .trim()
    .refine((value) => estados.map((e) => e.uf || e.nome).includes(value), {
      message: "Estado inválido",
    }),
});

export type FornecedorInput = z.infer<typeof FornecedorCreateSchema>;
