import { createSlice } from "@reduxjs/toolkit";

export const coinsSlice = createSlice({
  name: "coins",
  initialState: {
    value: null,
  },
  reducers: {
    setCoins: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setCoins } = coinsSlice.actions;

export default coinsSlice.reducer;
