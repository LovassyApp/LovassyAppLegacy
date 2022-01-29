import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type tokenState = {
    token: string | null;
};

const initialState: tokenState = {
    token: null,
};

export const tokenReducer = createSlice({
    name: 'token',
    initialState,
    reducers: {
        setToken: (state: tokenState, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        removeToken: (state: tokenState) => {
            state.token = null;
        },
    },
});

export const { setToken, removeToken } = tokenReducer.actions;

export default tokenReducer.reducer;
