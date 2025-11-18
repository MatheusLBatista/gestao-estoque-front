import z from "zod";

export const MovimentacaoCreateSchema = z.object({
  destino: z
    .string({ message: "Destino é obrigatório" })
    .trim()
    .min(2, "Informe pelo menos 2 caracteres"),

  tipo: z.enum(["entrada", "saida"], {
    message: "Tipo é obrigatório",
  }),

  observacoes: z.string().trim().optional(),

  nota_fiscal: z
    .object({
      numero: z.coerce.string({ message: "Número inválido" }).optional(),
      serie: z.coerce.string({ message: "Série inválida" }).optional(),
      chave: z.string().min(10, "Chave inválida").optional(),
      data_emissao: z.coerce.date({ message: "Data inválida" }).optional(),
    })
    .optional(),

  produtos: z
    .array(
      z.object({
        idProduto: z.string().min(1, "ID do produto é obrigatório"),
        codigo_produto: z.string().min(2, "Código inválido"),
        quantidade_produtos: z.coerce
          .number()
          .positive("Quantidade deve ser maior que 0"),
        custo: z.coerce.number().nonnegative("Custo inválido").optional(),
        preco: z.coerce.number().nonnegative("Preço inválido").optional(),
      })
    )
    .min(1, "Adicione pelo menos 1 produto"),
});

export type MovimentacaoCreateInput = z.infer<typeof MovimentacaoCreateSchema>;
