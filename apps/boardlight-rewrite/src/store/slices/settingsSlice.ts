import { ColorScheme } from "@mantine/core";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SettingsState {
  colorScheme: ColorScheme;
}

const initialState: SettingsState = {
    colorScheme: "light",
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setColorScheme: (state: SettingsState, action: PayloadAction<ColorScheme>) => {
            state.colorScheme = action.payload;
        },
    },
});

export const { setColorScheme } = settingsSlice.actions;

export default settingsSlice.reducer;
