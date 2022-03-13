import { createSlice } from "@reduxjs/toolkit";

export const kretaInitialState = {
  gradesValue: null,
};

// Timetable stuff is gonna go here as well
export const kretaSlice = createSlice({
  name: "kreta",
  initialState: kretaInitialState,
  reducers: {
    setGradeValue: (state, action) => {
      state.gradesValue = action.payload;
    },
  },
});

export const { setGradeValue } = kretaSlice.actions;

export default kretaSlice.reducer;
