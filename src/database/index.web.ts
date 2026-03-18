import { schema } from "./schemas";

export const DATABASE_NAME = "desafioTW.db";

export const schemas = schema;

export const useAppMigrations = () => ({
  success: true as const,
  error: null as Error | null,
});

function notSupported(): never {
  throw new Error("expo-sqlite is not supported on web for this app.");
}

export const expoDB = null as unknown;

// Keep a compatible surface area for callers, but fail only when used.
export const db = new Proxy(
  {},
  {
    get() {
      return notSupported;
    },
    apply() {
      return notSupported();
    },
  }
) as any;

export type Transaction = any;

