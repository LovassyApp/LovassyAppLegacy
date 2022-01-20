import { createSlice } from "@reduxjs/toolkit";

export const loloSlice = createSlice({
  name: "lolo",
  initialState: {
    value: null,
  },
  reducers: {
    setLolo: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setLolo } = loloSlice.actions;

export default loloSlice.reducer;
