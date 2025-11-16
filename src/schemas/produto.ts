import { z } from "zod";

export const ProdutoSchema = z.object({
  nome_produto: z
    .string({ message: "Nome do produto é obrigatório" })
    .trim()
    .min(2, "Informe pelo menos 2 caracteres"),

  descricao: z
    .string()
    .trim()
    .min(10, "A descrição deve ter pelo menos 10 caracteres")
    .optional(),

  preco: z
    .number({ message: "Preço é obrigatório" })
    .positive("O preço deve ser maior que zero"),

  marca: z
    .string({ message: "Marca é obrigatória" })
    .trim()
    .min(2, "Informe pelo menos 2 caracteres"),

  custo: z
    .number({ message: "Custo é obrigatório" })
    .positive("O custo deve ser maior que zero").optional(),

  estoque_min: z
    .number({ message: "Estoque mínimo é obrigatório" })
    .int("O estoque mínimo deve ser um número inteiro")
    .min(0, "O estoque mínimo não pode ser negativo"),

  fornecedores: z
    .string({ message: "Fornecedor é obrigatório" })
    .min(1, "Selecione um fornecedor"),

  codigo_produto: z
    .string({ message: "Código do produto é obrigatório" })
    .trim()
    .min(2, "Informe pelo menos 2 caracteres")
    .regex(
      /^[A-Z0-9-]+$/,
      "O código deve conter apenas letras maiúsculas, números e hífens"
    ),
});

export type FormData = z.infer<typeof ProdutoSchema>;
