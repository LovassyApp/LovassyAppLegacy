import { createSlice } from "@reduxjs/toolkit";

export const tokenSlice = createSlice({
  name: "token",
  initialState: {
    value: null,
    renewalError: false,
  },
  reducers: {
    setToken: (state, action) => {
      state.value = action.payload;
      state.renewalError = false;
    },
    removeToken: (state, action) => {
      state.value = null;
      state.renewalError = action.payload ?? false;
    },
    removeRenewalError: (state) => {
      state.renewalError = false;
    },
  },
});

export const { setToken, removeToken, removeRenewalError } = tokenSlice.actions;

export default tokenSlice.reducer;
