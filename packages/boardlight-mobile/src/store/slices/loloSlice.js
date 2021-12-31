import { createSlice } from "@reduxjs/toolkit";

export const loloSlice = createSlice({
  name: "lolo",
  initialState: {
    bal: null,
    coins: null,
  },
  reducers: {
    setLolo: (state, action) => {
      state.bal = action.payload.bal;
      state.coins = action.payload.coins;
      state.error = false;
    },
  },
});

export const { setLolo } = loloSlice.actions;

export default loloSlice.reducer;
