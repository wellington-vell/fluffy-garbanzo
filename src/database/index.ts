import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import * as SQLite from "expo-sqlite";
import migrations from "../../drizzle/migrations";
import { schema } from "./schemas";

export const DATABASE_NAME = "desafioTW.db";

export const expoDB = SQLite.openDatabaseSync(DATABASE_NAME, { enableChangeListener: true });
export const db = drizzle(expoDB, { schema });
export const useAppMigrations = () => useMigrations(db, migrations);
export const schemas = schema;
export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];