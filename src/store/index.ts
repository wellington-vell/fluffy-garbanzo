import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { appSlice } from './app';
import { clientesSlice } from './clientes';
import { clienteProdutosSlice } from './clienteProdutos';
import { produtosSlice } from './produtos';

export const store = configureStore({
    reducer: {
        app: appSlice.reducer,
        clients: clientesSlice.reducer,
        clienteProdutos: clienteProdutosSlice.reducer,
        produtos: produtosSlice.reducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export default store;