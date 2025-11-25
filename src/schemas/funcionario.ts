import { z } from "zod";

export const FuncionarioSchema = z.object({
  nome_usuario: z
    .string("Nome é obrigatório")
    .min(3, { message: "Nome deve ter no mínimo 3 caracteres" })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" }),

  email: z.string("E-mail é obrigatório").email({ message: "E-mail inválido" }),

  telefone: z
    .string("Telefone é obrigatório")
    .min(10, { message: "Telefone deve ter no mínimo 10 dígitos" })
    .max(15, { message: "Telefone deve ter no máximo 15 dígitos" }),

  perfil: z
    .string("Perfil é obrigatório")
    .min(1, { message: "Selecione um perfil" }),
  matricula: z
    .string("Matrícula é obrigatória")
    .trim()
    .min(2, "Informe pelo menos 2 caracteres")
    .regex(
      /^[A-Za-z0-9-]+$/,
      "A matrícula deve conter apenas letras, números e hífens"
    )
    .transform((val) => val.toUpperCase()),
});

export const FuncionarioEdicaoSchema = z.object({
  email: z.string("E-mail é obrigatório").email({ message: "E-mail inválido" }),

  telefone: z
    .string("Telefone é obrigatório")
    .min(10, { message: "Telefone deve ter no mínimo 10 dígitos" })
    .max(15, { message: "Telefone deve ter no máximo 15 dígitos" }),

  perfil: z
    .string("Perfil é obrigatório")
    .min(1, { message: "Selecione um perfil" }),
});

export type FormData = z.infer<typeof FuncionarioSchema>;
export type FormDataEdicao = z.infer<typeof FuncionarioEdicaoSchema>;
