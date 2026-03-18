import * as Yup from "yup";

export const clienteSchema = Yup.object().shape({
    id: Yup.number(),
    name: Yup.string().required("O nome é obrigatório"),
    sobrenome: Yup.string().required("O sobrenome é obrigatório"),
    email: Yup.string().email("O email é inválido").required("O email é obrigatório"),
    ativo: Yup.boolean().default(false),
});

export type ClienteSchema = Yup.InferType<typeof clienteSchema>;