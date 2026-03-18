import { ClienteDto } from '@/src/@DTO/ClienteDto';
import { createSlice } from '@reduxjs/toolkit';
import { createClientThunk, listClientThunk, updateClientThunk } from './thunks';

const initialState = {
    loading: false,
    list: [] as ClienteDto[],
}

export const clientesSlice = createSlice({
    name: 'clientes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(listClientThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(listClientThunk.rejected, (state) => {
                state.loading = false;
            })
            .addCase(listClientThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })

            .addCase(createClientThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(createClientThunk.rejected, (state) => {
                state.loading = false;
            })
            .addCase(createClientThunk.fulfilled, (state) => {
                state.loading = false;
            })

            .addCase(updateClientThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateClientThunk.rejected, (state) => {
                state.loading = false;
            })
            .addCase(updateClientThunk.fulfilled, (state) => {
                state.loading = false;
            })
    }
});

export const { } = clientesSlice.actions