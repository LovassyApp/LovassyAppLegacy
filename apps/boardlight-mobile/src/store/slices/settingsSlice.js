import { createSlice } from "@reduxjs/toolkit";
import { lightTheme } from "../../utils/theme/themes";

export const settingsInitialState = {
  theme: lightTheme,
  predictiveLoad: false,
  admin: false,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState: settingsInitialState,
  reducers: {
    setAdmin: (state, action) => {
      state.admin = action.payload;
    },
    setState: (state, action) => {
      state.theme = action.payload.theme;
      state.predictiveLoad = action.payload.predictiveLoad;
      // add all other state values here except for admin, we don't want to load that
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setPredictiveLoad: (state, action) => {
      state.predictiveLoad = action.payload;
    },
  },
});

export const { setTheme, setState, setPredictiveLoad, setAdmin } = settingsSlice.actions;

export default settingsSlice.reducer;
