import { createSlice } from "@reduxjs/toolkit";
import { lightTheme } from "../../utils/theme/themes";

export const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    theme: lightTheme,
    predictiveLoad: false,
  },
  reducers: {
    setState: (state, action) => {
      state.theme = action.payload.theme;
      state.predictiveLoad = action.payload.predictiveLoad;
      // add all other state values here
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setPredictiveLoad: (state, action) => {
      state.predictiveLoad = action.payload;
    },
  },
});

export const { setTheme, setState, setPredictiveLoad } = settingsSlice.actions;

export default settingsSlice.reducer;
