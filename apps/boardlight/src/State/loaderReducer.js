import { createSlice } from '@reduxjs/toolkit';

export const loaderReducer = createSlice({
	name: 'loader',
	initialState: {
		loader: false,
	},
	reducers: {
		forceLoader: (state) => {
			state.loader = true;
		},
		removeLoader: (state) => {
			state.loader = false;
		},
	},
});

export const { forceLoader, removeLoader } = loaderReducer.actions;

export default loaderReducer.reducer;
