import { db, schemas } from "@/src/database";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { eq } from "drizzle-orm";
import { Alert } from "react-native";

export type ClienteProdutoLinkItem = {
  produtoId: number;
  quantidade: number;
};

export const listClienteProdutosThunk = createAsyncThunk(
  "clienteProdutos/listByCliente",
  async (clienteId: number, { rejectWithValue }) => {
    try {
      return await db
        .select()
        .from(schemas.clienteProduto)
        .where(eq(schemas.clienteProduto.clienteId, clienteId));
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao listar produtos vinculados";
      Alert.alert("Erro", message);
      throw rejectWithValue(message);
    }
  }
);

export const saveClienteProdutosThunk = createAsyncThunk(
  "clienteProdutos/saveForCliente",
  async (
    {
      clienteId,
      items,
    }: { clienteId: number; items: ClienteProdutoLinkItem[] },
    { rejectWithValue }
  ) => {
    try {
      const now = new Date().toISOString();

      await db.transaction(async (tx) => {
        await tx
          .delete(schemas.clienteProduto)
          .where(eq(schemas.clienteProduto.clienteId, clienteId));

        if (items.length === 0) return;

        await tx.insert(schemas.clienteProduto).values(
          items.map((i) => ({
            clienteId,
            produtoId: i.produtoId,
            quantidade: Math.max(1, i.quantidade || 1),
            dataVinculo: now,
          }))
        );
      });

      return true;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao salvar vínculos";
      Alert.alert("Erro", message);
      throw rejectWithValue(message);
    }
  }
);

