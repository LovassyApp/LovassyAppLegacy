import { createSlice } from '@reduxjs/toolkit';

export interface privacyPolicyModalState {
    isOpen: boolean;
}

const initialState: privacyPolicyModalState = {
    isOpen: false,
};

const privacyPolicyModalReducerObj = {
    name: 'privacyPolicyModal',
    initialState,
    reducers: {
        openPrivacyPolicyModal: (state: privacyPolicyModalState) => {
            state.isOpen = true;
        },
        closePrivacyPolicyModal: (state: privacyPolicyModalState) => {
            state.isOpen = false;
        },
    },
};

export const privacyPolicyModalReducer = createSlice(privacyPolicyModalReducerObj);

export const { closePrivacyPolicyModal, openPrivacyPolicyModal } =
    privacyPolicyModalReducer.actions;

export default privacyPolicyModalReducer.reducer;
