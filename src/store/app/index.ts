import { createSlice } from '@reduxjs/toolkit';
import { version } from '../../../package.json';

const initialState = {
    version
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {}
});

export const { } = appSlice.actions