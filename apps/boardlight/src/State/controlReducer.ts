import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BlueboardControl } from 'blueboard-client';

export type controlState = {
    control: BlueboardControl;
};

const initialState: controlState = {
    control: {} as BlueboardControl,
};

const controlReducerObj = {
    name: 'control',
    initialState,
    reducers: {
        setControl: (state: controlState, action: PayloadAction<BlueboardControl>) => {
            state.control = action.payload;
        },
        removeControl: (state: controlState) => {
            state.control = {} as BlueboardControl;
        },
    },
};

export const controlReducer = createSlice(controlReducerObj);

export const { setControl, removeControl } = controlReducer.actions;

export default controlReducer.reducer;
