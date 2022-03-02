import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { BlueboardProduct } from "blueboard-client";

export interface StoreState {
    value: BlueboardProduct[];
}

const initialState: StoreState = {
    value: null,
};

export const storeSlice = createSlice({
    name: "store",
    initialState,
    reducers: {
        setStore: (state: StoreState, action: PayloadAction<BlueboardProduct[]>) => {
            state.value = action.payload;
        },
    },
});

export const { setStore } = storeSlice.actions;

export default storeSlice.reducer;
