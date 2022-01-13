import { createSlice } from '@reduxjs/toolkit';

export const controlReducer = createSlice({
	name: 'control',
	initialState: {
		control: {},
	},
	reducers: {
		setControl: (state, action) => {
			state.control = action.payload;
		},
		removeControl: (state) => {
			state.control = {};
		},
	},
});

export const { setControl, removeControl } = controlReducer.actions;

export default controlReducer.reducer;
