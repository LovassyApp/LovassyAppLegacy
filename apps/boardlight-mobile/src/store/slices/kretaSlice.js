import { createSlice } from "@reduxjs/toolkit";

export const kretaSlice = createSlice({
  name: "kreta",
  initialState: {
    gradesValue: null,
  },
  reducers: {
    setLolo: (state, action) => {
      state.gradesValue = action.payload;
    },
  },
});

export const { setLolo } = kretaSlice.actions;

export default kretaSlice.reducer;
