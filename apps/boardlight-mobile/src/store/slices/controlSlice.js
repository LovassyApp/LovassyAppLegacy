import { createSlice } from "@reduxjs/toolkit";

export const controlSlice = createSlice({
  name: "control",
  initialState: {
    value: null,
  },
  reducers: {
    setControl: (state, action) => {
      state.value = action.payload;
    },
    removeControl: (state) => {
      state.value = null;
    },
  },
});

export const { setControl, removeControl } = controlSlice.actions;

export default controlSlice.reducer;
