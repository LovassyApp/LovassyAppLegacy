import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { BlueboardKretaGrade } from "blueboard-client";

export interface KretaState {
    grades: BlueboardKretaGrade[];
}

const initialState: KretaState = {
    grades: null,
};

export const kretaSlice = createSlice({
    name: "kreta",
    initialState,
    reducers: {
        setGrades: (state: KretaState, action: PayloadAction<BlueboardKretaGrade[]>) => {
            state.grades = action.payload;
        },
    },
});

export const { setGrades } = kretaSlice.actions;

export default kretaSlice.reducer;
