import { db, schemas } from "@/src/database";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { inArray } from "drizzle-orm";
import { Alert } from "react-native";

type ClienteSeed = {
  nome: string;
  sobrenome: string;
  email: string;
  ativo: boolean;
};

type ProdutoSeed = {
  nome: string;
  descricao: string | null;
  preco: number;
  ativo: boolean;
  imagemUri: string | null;
};

type LinkSeed = {
  clienteEmail: string;
  produtoNome: string;
  quantidade: number;
};

const clientes: ClienteSeed[] = [
  { nome: "Ana", sobrenome: "Silva", email: "ana.silva@example.com", ativo: true },
  { nome: "Bruno", sobrenome: "Souza", email: "bruno.souza@example.com", ativo: true },
  { nome: "Carla", sobrenome: "Oliveira", email: "carla.oliveira@example.com", ativo: false },
];

const produtos: ProdutoSeed[] = [
  {
    nome: "Notebook",
    descricao: '14" 16GB RAM',
    preco: 3999.9,
    ativo: true,
    imagemUri: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
  },
  {
    nome: "Mouse",
    descricao: "Sem fio",
    preco: 129.9,
    ativo: true,
    imagemUri: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400",
  },
  {
    nome: "Teclado",
    descricao: "Mecânico",
    preco: 299.9,
    ativo: true,
    imagemUri: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400",
  },
  {
    nome: "Headset",
    descricao: null,
    preco: 199.9,
    ativo: true,
    imagemUri: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
  },
  {
    nome: "Monitor",
    descricao: '24" IPS',
    preco: 899.9,
    ativo: true,
    imagemUri: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400",
  },
];

const links: LinkSeed[] = [
  { clienteEmail: "ana.silva@example.com", produtoNome: "Notebook", quantidade: 1 },
  { clienteEmail: "ana.silva@example.com", produtoNome: "Mouse", quantidade: 2 },
  { clienteEmail: "bruno.souza@example.com", produtoNome: "Teclado", quantidade: 1 },
  { clienteEmail: "bruno.souza@example.com", produtoNome: "Monitor", quantidade: 1 },
  { clienteEmail: "carla.oliveira@example.com", produtoNome: "Headset", quantidade: 3 },
];

export const seedDatabaseThunk = createAsyncThunk(
  "seed/run",
  async (_, { rejectWithValue }) => {
    try {
      const now = new Date().toISOString();

      await db.transaction(async (tx) => {
        // Clear existing data (order matters because of relations)
        await tx.delete(schemas.clienteProduto);
        await tx.delete(schemas.produto);
        await tx.delete(schemas.cliente);

        await tx.insert(schemas.cliente).values(
          clientes.map((c) => ({
            nome: c.nome,
            sobrenome: c.sobrenome,
            email: c.email,
            ativo: c.ativo,
            dataCadastro: now,
          }))
        );

        await tx.insert(schemas.produto).values(
          produtos.map((p) => ({
            nome: p.nome,
            descricao: p.descricao,
            preco: p.preco,
            ativo: p.ativo,
            imagemUri: p.imagemUri,
          }))
        );

        const clienteRows = await tx
          .select({ id: schemas.cliente.id, email: schemas.cliente.email })
          .from(schemas.cliente)
          .where(inArray(schemas.cliente.email, clientes.map((c) => c.email)));

        const produtoRows = await tx
          .select({ id: schemas.produto.id, nome: schemas.produto.nome })
          .from(schemas.produto)
          .where(inArray(schemas.produto.nome, produtos.map((p) => p.nome)));

        const clienteIdByEmail = new Map(clienteRows.map((r) => [r.email, r.id]));
        const produtoIdByNome = new Map(produtoRows.map((r) => [r.nome, r.id]));

        await tx.insert(schemas.clienteProduto).values(
          links.map((l) => ({
            clienteId: clienteIdByEmail.get(l.clienteEmail)!,
            produtoId: produtoIdByNome.get(l.produtoNome)!,
            quantidade: Math.max(1, l.quantidade),
            dataVinculo: now,
          }))
        );
      });

      return true;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Ocorreu um erro ao executar o seed";
      Alert.alert("Erro", message);
      throw rejectWithValue(message);
    }
  }
);

