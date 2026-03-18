import { ProdutoDto } from "@/src/@DTO/ProdutoDto";
import { db, schemas } from "@/src/database";
import { ProdutoSchema } from "@/src/validations/produto.schema";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { eq } from "drizzle-orm";
import { Alert } from "react-native";

export const listProdutoThunk = createAsyncThunk(
  "produtos/list",
  async (_, { rejectWithValue }) => {
    try {
      return (await db.query.produto.findMany()) as ProdutoDto[];
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao listar os produtos";
      Alert.alert("Erro", message);
      throw rejectWithValue(message);
    }
  }
);

export const getProdutoThunk = createAsyncThunk(
  "produtos/get",
  async (id: number, { rejectWithValue }) => {
    try {
      return await db.query.produto.findFirst({
        where(fields, operators) {
          return operators.eq(fields.id, id);
        },
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao buscar o produto";
      Alert.alert("Erro", message);
      throw rejectWithValue(message);
    }
  }
);

export const createProdutoThunk = createAsyncThunk(
  "produtos/create",
  async (data: ProdutoSchema, { rejectWithValue, dispatch }) => {
    try {
      await db.insert(schemas.produto).values({
        nome: data.nome,
        descricao: data.descricao ?? null,
        preco: data.preco ?? 0,
        ativo: data.ativo ?? true,
        imagemUri: data.imagemUri ?? null,
      });
      await dispatch(listProdutoThunk());
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao criar o produto";
      Alert.alert("Erro", message);
      throw rejectWithValue(message);
    }
  }
);

export const updateProdutoThunk = createAsyncThunk(
  "produtos/update",
  async (data: ProdutoSchema, { rejectWithValue, dispatch }) => {
    try {
      if (!data.id) {
        throw new Error("Id não encontrado!");
      }

      await db
        .update(schemas.produto)
        .set({
          nome: data.nome,
          descricao: data.descricao ?? null,
          preco: data.preco ?? 0,
          ativo: data.ativo ?? true,
          imagemUri: data.imagemUri ?? null,
        })
        .where(eq(schemas.produto.id, data.id));

      await dispatch(listProdutoThunk());
      return data;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao atualizar o produto";
      Alert.alert("Erro", message);
      throw rejectWithValue(message);
    }
  }
);

export const deleteProdutoThunk = createAsyncThunk(
  "produtos/delete",
  async (id: number, { rejectWithValue, dispatch }) => {
    try {
      await db.delete(schemas.produto).where(eq(schemas.produto.id, id));
      await dispatch(listProdutoThunk());
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao excluir o produto";
      Alert.alert("Erro", message);
      throw rejectWithValue(message);
    }
  }
);

