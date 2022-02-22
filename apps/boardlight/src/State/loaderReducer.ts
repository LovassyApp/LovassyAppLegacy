import { createSlice } from "@reduxjs/toolkit";

export interface loaderState {
    loader: boolean;
}

const initialState: loaderState = {
    loader: false,
};

const loaderReducerObj = {
    name: "loader",
    initialState,
    reducers: {
        forceLoader: (state: loaderState) => {
            state.loader = true;
        },
        removeLoader: (state: loaderState) => {
            state.loader = false;
        },
    },
};

export const loaderReducer = createSlice(loaderReducerObj);

export const { forceLoader, removeLoader } = loaderReducer.actions;

export default loaderReducer.reducer;
