import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { BlueboardInventoryItem } from "blueboard-client";

export interface InventoryState {
    value: BlueboardInventoryItem[];
}

const initialState: InventoryState = {
    value: null,
};

export const inventorySlice = createSlice({
    name: "inventory",
    initialState,
    reducers: {
        setInventory: (state: InventoryState, action: PayloadAction<BlueboardInventoryItem[]>) => {
            state.value = action.payload;
        },
    },
});

export const { setInventory } = inventorySlice.actions;

export default inventorySlice.reducer;
