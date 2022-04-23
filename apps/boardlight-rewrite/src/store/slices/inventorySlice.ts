import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { BlueboardInventoryItem } from "blueboard-client";

export interface InventoryState {
    items: BlueboardInventoryItem[];
}

const initialState: InventoryState = {
    items: null,
};

export const inventorySlice = createSlice({
    name: "inventory",
    initialState,
    reducers: {
        setInventory: (state: InventoryState, action: PayloadAction<BlueboardInventoryItem[]>) => {
            state.items = action.payload;
        },
    },
});

export const { setInventory } = inventorySlice.actions;

export default inventorySlice.reducer;
