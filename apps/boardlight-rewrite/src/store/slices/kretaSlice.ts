import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { BlueboardKretaGradeData } from "blueboard-client";

export interface KretaState {
    gradeData: BlueboardKretaGradeData[];
}

const initialState: KretaState = {
    gradeData: null,
};

export const kretaSlice = createSlice({
    name: "kreta",
    initialState,
    reducers: {
        setGradeData: (state: KretaState, action: PayloadAction<BlueboardKretaGradeData[]>) => {
            state.gradeData = action.payload;
        },
    },
});

export const { setGradeData } = kretaSlice.actions;

export default kretaSlice.reducer;
