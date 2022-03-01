import { createSlice } from '@reduxjs/toolkit';

export interface settingsModalState {
    isOpen: boolean;
}

const initialState: settingsModalState = {
    isOpen: false,
};

const settingsModalReducerObj = {
    name: 'settingsModal',
    initialState,
    reducers: {
        openSettingsModal: (state: settingsModalState) => {
            state.isOpen = true;
        },
        closeSettingsModal: (state: settingsModalState) => {
            state.isOpen = false;
        },
    },
};

export const settingsModalReducer = createSlice(settingsModalReducerObj);

export const { closeSettingsModal, openSettingsModal } = settingsModalReducer.actions;

export default settingsModalReducer.reducer;
