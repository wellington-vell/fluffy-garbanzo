import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const cliente = sqliteTable("Cliente", {
    id: integer("Id").primaryKey({ autoIncrement: true }),
    nome: text("Nome").notNull(),
    sobrenome: text("Sobrenome").notNull(),
    email: text("Email").notNull(),
    dataCadastro: text("DataCadastro").notNull(),
    ativo: integer("Ativo", { mode: "boolean" }).default(false)
});
