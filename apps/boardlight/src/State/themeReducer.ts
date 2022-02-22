import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface themeState {
    isDark: boolean;
    systemMode: string;
    isSynced: boolean;
}

const initialState: themeState = {
    isDark: false,
    systemMode: "light",
    isSynced: false,
};

export const themeReducer = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggle: (state: themeState) => {
            state.isDark = !state.isDark;
        },
        setDark: (state: themeState, action: PayloadAction<boolean>) => {
            state.isDark = action.payload;
        },
        setSystemMode: (state: themeState, action: PayloadAction<string>) => {
            state.systemMode = action.payload;
        },
        setSynced: (state: themeState, action: PayloadAction<boolean>) => {
            state.isSynced = action.payload;
        },
    },
});

export const { setDark, setSystemMode, toggle, setSynced } = themeReducer.actions;

export default themeReducer.reducer;
