import { z } from "zod";

export const DefinirSenhaSchema = z
  .object({
    codigo: z
      .string("Código é obrigatório")
      .min(1, "Código é obrigatório")
      .length(6, "O código deve ter 6 caracteres"),
    matricula: z
      .string("Matrícula é obrigatória")
      .min(1, "Matrícula é obrigatória"),
    senha: z
      .string("Senha é obrigatória")
      .min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmarSenha: z
      .string("Confirmação de senha é obrigatória")
      .min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

export type DefinirSenhaFormData = z.infer<typeof DefinirSenhaSchema>;
