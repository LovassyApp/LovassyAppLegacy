import { createSlice } from "@reduxjs/toolkit";
import { lightTheme } from "../../utils/theme/themes";

export const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    theme: lightTheme,
  },
  reducers: {
    setState: (state, action) => {
      state.theme = action.payload.theme;
      // add all other state values here
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const { setTheme, setState } = settingsSlice.actions;

export default settingsSlice.reducer;
