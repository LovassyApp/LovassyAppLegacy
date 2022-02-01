import { createSlice } from "@reduxjs/toolkit";

// Timetable stuff is gonna go here as well
export const kretaSlice = createSlice({
  name: "kreta",
  initialState: {
    gradesValue: null,
  },
  reducers: {
    setGradeValue: (state, action) => {
      state.gradesValue = action.payload;
    },
  },
});

export const { setGradeValue } = kretaSlice.actions;

export default kretaSlice.reducer;
