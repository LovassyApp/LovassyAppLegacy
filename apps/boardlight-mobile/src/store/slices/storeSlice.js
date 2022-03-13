import { createSlice } from "@reduxjs/toolkit";

export const storeInitialState = {
  value: null,
};

export const storeSlice = createSlice({
  name: "store",
  initialState: storeInitialState,
  reducers: {
    setStore: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setStore } = storeSlice.actions;

export default storeSlice.reducer;
