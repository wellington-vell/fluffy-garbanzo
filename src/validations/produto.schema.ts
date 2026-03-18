import * as Yup from "yup";

export const produtoSchema = Yup.object().shape({
  id: Yup.number(),
  nome: Yup.string().required("O nome é obrigatório"),
  descricao: Yup.string().nullable().default(null),
  preco: Yup.number()
    .transform((value, originalValue) => {
      if (typeof originalValue === "string") {
        const normalized = originalValue.replace(",", ".");
        const parsed = Number(normalized);
        return Number.isFinite(parsed) ? parsed : value;
      }
      return value;
    })
    .min(0, "O preço não pode ser negativo")
    .required("O preço é obrigatório"),
  ativo: Yup.boolean().default(true),
  imagemUri: Yup.string()
    .nullable()
    .default(null)
    .test("url-or-file", "URL inválida", (value) => {
      if (!value || value.trim() === "") return true;
      return value.startsWith("http://") || value.startsWith("https://") || value.startsWith("file://");
    }),
});

export type ProdutoSchema = Yup.InferType<typeof produtoSchema>;

