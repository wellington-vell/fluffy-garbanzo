import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const clienteProduto = sqliteTable("ClienteProduto", {
  id: integer("Id").primaryKey({ autoIncrement: true }),
  clienteId: integer("ClienteId").notNull(),
  produtoId: integer("ProdutoId").notNull(),
  quantidade: integer("Quantidade").notNull().default(1),
  dataVinculo: text("DataVinculo").notNull(),
});

