import { createSlice } from "@reduxjs/toolkit";

export const inventorySlice = createSlice({
  name: "inventory",
  initialState: {
    value: null,
  },
  reducers: {
    setInventory: (state, action) => {
      state.value = action.payload;
    },
    addItem: (state, action) => {
      state.value.push(action.payload);
    },
    updateItem: (state, action) => {
      const index = state.value.findIndex((item) => item.id === action.payload.id);
      state.value[index] = action.payload;
    },
  },
});

export const { setInventory, addItem, updateItem } = inventorySlice.actions;

export default inventorySlice.reducer;
