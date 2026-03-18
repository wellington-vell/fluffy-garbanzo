import { db, schemas } from "@/src/database";
import { ClienteSchema } from "@/src/validations/cliente.schema";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { eq, InferInsertModel } from "drizzle-orm";
import { Alert } from "react-native";

export const listClientThunk = createAsyncThunk(
    "clientes/list",
    async (_, { rejectWithValue }) => {
        try {
            return await db.query.cliente.findMany();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Ocorreu um erro ao criar o cliente";
            Alert.alert("Erro", message);
            throw rejectWithValue(message);
        }
    }
)

export const getClientThunk = createAsyncThunk(
    "clientes/get",
    async (id: number, { rejectWithValue }) => {
        try {
            return await db.query.cliente.findFirst({
                where(fields, operators) {
                    return operators.eq(fields.id, id)
                },
            });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Ocorreu um erro ao criar o cliente";
            Alert.alert("Erro", message);
            throw rejectWithValue(message);
        }
    }
)

export const createClientThunk = createAsyncThunk(
    "clientes/create",
    async (data: ClienteSchema, { rejectWithValue }) => {
        try {
            await db.insert(schemas.cliente).values({
                nome: data.name,
                sobrenome: data.sobrenome,
                email: data.email,
                dataCadastro: new Date().toISOString(),
                ativo: data.ativo,
            });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Ocorreu um erro ao criar o cliente";
            Alert.alert("Erro", message);
            throw rejectWithValue(message);
        }
    }
)

export const updateClientThunk = createAsyncThunk(
    "clientes/update",
    async (data: ClienteSchema, { rejectWithValue }) => {
        try {
            if (!data.id) {
                throw new Error("Id não encontrado!")
            }

            const clientUpdated: InferInsertModel<typeof schemas.cliente> = {
                nome: data.name,
                sobrenome: data.sobrenome,
                email: data.email,
                dataCadastro: new Date().toISOString(),
                ativo: data.ativo
            };

            await db
                .update(schemas.cliente)
                .set(clientUpdated)
                .where(eq(schemas.cliente.id, data.id));
            return data;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Ocorreu um erro ao atualizar o cliente";
            Alert.alert("Erro", message);
            throw rejectWithValue(message);
        }
    }
)

export const deleteClientThunk = createAsyncThunk(
    "clientes/delete",
    async (id: number, { rejectWithValue, dispatch }) => {
        try {
            await db.delete(schemas.cliente).where(eq(schemas.cliente.id, id));
            await dispatch(listClientThunk());
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Ocorreu um erro ao excluir o cliente";
            Alert.alert("Erro", message);
            throw rejectWithValue(message);
        }
    }
)