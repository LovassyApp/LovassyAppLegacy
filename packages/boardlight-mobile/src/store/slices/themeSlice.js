import { createSlice } from "@reduxjs/toolkit";
import { lightTheme } from "../../utils/theme/themes";

export const themeSlice = createSlice({
  name: "theme",
  initialState: {
    value: lightTheme,
  },
  reducers: {
    setTheme: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
