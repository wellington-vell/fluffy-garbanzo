import { createSlice } from "@reduxjs/toolkit";
import { listClienteProdutosThunk, saveClienteProdutosThunk } from "./thunks";

type ClienteProdutoRow = {
  id: number;
  clienteId: number;
  produtoId: number;
  quantidade: number;
  dataVinculo: string;
};

type State = {
  loading: boolean;
  byClienteId: Record<number, ClienteProdutoRow[]>;
};

const initialState: State = {
  loading: false,
  byClienteId: {},
};

export const clienteProdutosSlice = createSlice({
  name: "clienteProdutos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listClienteProdutosThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(listClienteProdutosThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(listClienteProdutosThunk.fulfilled, (state, action) => {
        state.loading = false;
        const clienteId = action.meta.arg;
        state.byClienteId[clienteId] = action.payload as ClienteProdutoRow[];
      })
      .addCase(saveClienteProdutosThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveClienteProdutosThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(saveClienteProdutosThunk.fulfilled, (state) => {
        state.loading = false;
      });
  },
});
