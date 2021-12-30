import { createSlice } from '@reduxjs/toolkit';

export const tokenReducer = createSlice({
	name: 'token',
	initialState: {
		token: null,
	},
	reducers: {
		setToken: (state, action) => {
			state.token = action.payload;
		},
		removeToken: (state) => {
			state.token = null;
		},
	},
});

export const { setToken, removeToken } = tokenReducer.actions;

export default tokenReducer.reducer;
