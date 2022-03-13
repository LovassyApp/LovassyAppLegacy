import { createSlice } from "@reduxjs/toolkit";

export const coinsInitialState = {
  value: null,
};

export const coinsSlice = createSlice({
  name: "coins",
  initialState: coinsInitialState,
  reducers: {
    setCoins: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setCoins } = coinsSlice.actions;

export default coinsSlice.reducer;
