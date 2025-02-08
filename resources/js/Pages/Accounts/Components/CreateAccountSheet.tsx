import { z } from "zod";

const FormSchema = z.object({
    name: z
        .string({ required_error: "O nome é obrigatório." })
        .min(3, {
            message: "O nome precisa conter no mínimo 3 caracteres.",
        })
        .max(50, {
            message: "O nome pode conter no máximo 50 caracteres.",
        }),
    description: z
        .string()
        .max(255, {
            message: "A descrição precisa conter no máximo 255 caracteres.",
        })
        .optional(),
    number: z
        .string({ required_error: "O número é obrigatório." })
        .length(8, {
            message: "O número precisa conter 8 caracteres.",
        }),
    check_digit: z
        .string({ required_error: "Obrigatório" })
        .length(1, {
            message: "O dígito verificador precisa conter 1 caractere.",
        }),
    bank_id: z
        .string({ required_error: "O código do banco é obrigatório." })
        .length(3, {
            message: "O código do banco precisa conter 3 caracteres.",
        }),
    color: z
        .string({ required_error: "A cor é obrigatória." }),


    bank_name: z.string({ required_error: "O banco é obrigatório." })

})
