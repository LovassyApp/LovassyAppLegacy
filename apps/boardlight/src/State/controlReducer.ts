import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BlueboardControl, BlueboardUser, BlueboardUserGroup } from 'blueboard-client';

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
        setGroups: (state: controlState, action: PayloadAction<Array<BlueboardUserGroup>>) => {
            // Pfuj. ESNext
            const newPermissions = [...new Set(action.payload.map((el) => el.permissions).flat())];

            const newControl = new BlueboardControl(
                state.control.user,
                state.control.session,
                newPermissions,
                action.payload
            );

            state.control = newControl;
        },
        setUser: (state: controlState, action: PayloadAction<BlueboardUser>) => {
            const newControl = new BlueboardControl(
                action.payload,
                state.control.session,
                state.control.permissions,
                state.control.groups
            );

            state.control = newControl;
        },
    },
};

export const controlReducer = createSlice(controlReducerObj);

export const { setControl, removeControl, setGroups, setUser } = controlReducer.actions;

export default controlReducer.reducer;
