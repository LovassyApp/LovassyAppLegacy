import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LoadingState {
    value: boolean;
    message: string;
}

const initialState: LoadingState = {
    value: false,
    message: "",
};

const loadingSlice = createSlice({
    name: "loading",
    initialState,
    reducers: {
        setLoading: (state: LoadingState, action: PayloadAction<boolean>) => {
            state.value = action.payload;
        },
        setMessage: (state: LoadingState, action: PayloadAction<string>) => {
            state.message = action.payload;
        },
    },
});

export const { setLoading, setMessage } = loadingSlice.actions;

export default loadingSlice.reducer;
