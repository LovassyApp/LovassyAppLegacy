import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { BlueboardLoloRequest } from "blueboard-client";

export interface RequestsState {
    value: BlueboardLoloRequest[];
}

const initialState: RequestsState = {
    value: null,
};

export const requestsSlice = createSlice({
    name: "requests",
    initialState,
    reducers: {
        setRequests: (state: RequestsState, action: PayloadAction<BlueboardLoloRequest[]>) => {
            state.value = action.payload;
        },
    },
});

export const { setRequests } = requestsSlice.actions;

export default requestsSlice.reducer;
