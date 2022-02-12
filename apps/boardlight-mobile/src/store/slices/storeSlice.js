import { createSlice } from "@reduxjs/toolkit";

export const storeSlice = createSlice({
  name: "store",
  initialState: {
    value: null,
  },
  reducers: {
    setStore: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setStore } = storeSlice.actions;

export default storeSlice.reducer;
