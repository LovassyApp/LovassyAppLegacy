import { createSlice } from '@reduxjs/toolkit';

export const themeReducer = createSlice({
	name: 'theme',
	initialState: {
		isDark: false,
	},
	reducers: {
		toggle: (state) => {
			state.isDark = !state.isDark;
		},
	},
});

export const { toggle } = themeReducer.actions;

export default themeReducer.reducer;
