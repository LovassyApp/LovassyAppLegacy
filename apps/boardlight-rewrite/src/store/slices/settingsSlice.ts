import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { ColorScheme } from "@mantine/core";

export interface SettingsState {
    colorScheme: ColorScheme;
    primaryColor: string;
}

const initialState: SettingsState = {
    colorScheme: "light",
    primaryColor: "blue",
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setColorScheme: (state: SettingsState, action: PayloadAction<ColorScheme>) => {
            state.colorScheme = action.payload;
        },
        setPrimaryColor: (state: SettingsState, action: PayloadAction<string>) => {
            state.primaryColor = action.payload;
        },
    },
});

export const { setColorScheme, setPrimaryColor } = settingsSlice.actions;

export default settingsSlice.reducer;
