import { ProdutoDto } from "@/src/@DTO/ProdutoDto";
import { createSlice } from "@reduxjs/toolkit";
import {
  createProdutoThunk,
  deleteProdutoThunk,
  listProdutoThunk,
  updateProdutoThunk,
} from "./thunks";

const initialState = {
  loading: false,
  list: [] as ProdutoDto[],
};

export const produtosSlice = createSlice({
  name: "produtos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listProdutoThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(listProdutoThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(listProdutoThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(createProdutoThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProdutoThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createProdutoThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProdutoThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProdutoThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateProdutoThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteProdutoThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProdutoThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteProdutoThunk.fulfilled, (state) => {
        state.loading = false;
      });
  },
});
