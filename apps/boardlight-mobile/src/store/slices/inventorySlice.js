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
  },
});

export const { setInventory } = inventorySlice.actions;

export default inventorySlice.reducer;
