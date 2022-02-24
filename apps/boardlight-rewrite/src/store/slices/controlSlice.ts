import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BlueboardControl, BlueboardUser, BlueboardUserGroup } from "blueboard-client";

export interface ControlState {
    value: BlueboardControl;
}

const initialState: ControlState = {
    value: null,
};

const controlSlice = createSlice({
    name: "control",
    initialState,
    reducers: {
        setControl: (state: ControlState, action: PayloadAction<BlueboardControl>) => {
            state.value = action.payload;
        },
        removeControl: (state: ControlState) => {
            state.value = null;
        },
        setGroups: (state: ControlState, action: PayloadAction<BlueboardUserGroup[]>) => {
            const newPermissions = [
                ...new Set(action.payload.map((element) => element.permissions).flat()),
            ];

            const newControl = {
                ...state.value,
                groups: action.payload,
                permissions: newPermissions,
            };

            state.value = newControl;
        },
        setUser: (state: ControlState, action: PayloadAction<BlueboardUser>) => {
            const newControl = new BlueboardControl(
                action.payload,
                state.value.session,
                state.value.permissions,
                state.value.groups,
            );

            state.value = newControl;
        },
    },
});

export const { setControl, removeControl, setGroups, setUser } = controlSlice.actions;

export default controlSlice.reducer;
