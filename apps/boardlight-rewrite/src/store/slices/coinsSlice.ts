import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { BlueboardLoloCoin } from "blueboard-client";

export interface CoinsState {
    value: BlueboardLoloCoin[];
}

const initialState: CoinsState = {
    value: null,
};

export const coinsSlice = createSlice({
    name: "coins",
    initialState,
    reducers: {
        setCoins: (state: CoinsState, action: PayloadAction<BlueboardLoloCoin[]>) => {
            state.value = action.payload;
        },
    },
});

export const { setCoins } = coinsSlice.actions;

export default coinsSlice.reducer;
