import * as clienteDBSchema from "./clienteDBSchema";
import * as produtoDBSchema from "./produtoDBSchema";
import * as clienteProdutoDBSchema from "./clienteProdutoDBSchema";

export const schema = {
  ...clienteDBSchema,
  ...produtoDBSchema,
  ...clienteProdutoDBSchema,
};