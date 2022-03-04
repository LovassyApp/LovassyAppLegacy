import { BlueboardControl, BlueboardUser, BlueboardUserGroup } from "blueboard-client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

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
        setUserBalance: (state: ControlState, action: PayloadAction<number>) => {
            const newControl = {
                ...state.value,
                user: {
                    ...state.value.user,
                    balance: action.payload,
                },
            };
            state.value = newControl;
        },
    },
});

export const { setControl, removeControl, setGroups, setUser, setUserBalance } =
    controlSlice.actions;

export default controlSlice.reducer;
