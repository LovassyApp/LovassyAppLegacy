import { createSlice } from "@reduxjs/toolkit";

export const adminSlice = createSlice({
  name: "admin",
  initialState: {
    value: false,
  },
  reducers: {
    setAdmin: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setAdmin } = adminSlice.actions;

export default adminSlice.reducer;
