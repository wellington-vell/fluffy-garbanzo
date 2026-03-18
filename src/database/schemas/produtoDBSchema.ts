import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const produto = sqliteTable("Produto", {
  id: integer("Id").primaryKey({ autoIncrement: true }),
  nome: text("Nome").notNull(),
  descricao: text("Descricao"),
  preco: real("Preco").notNull().default(0),
  ativo: integer("Ativo", { mode: "boolean" }).notNull().default(true),
  imagemUri: text("ImagemUri"),
});

