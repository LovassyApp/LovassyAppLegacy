import { createSlice } from "@reduxjs/toolkit";

export const refreshTokenSlice = createSlice({
  name: "refreshToken",
  initialState: {
    value: null,
    renewalError: false,
  },
  reducers: {
    setRefreshToken: (state, action) => {
      state.value = action.payload;
      state.renewalError = false;
    },
    removeRefreshToken: (state, action) => {
      state.value = null;
      state.renewalError = action.payload ?? false;
    },
    removeRenewalError: (state) => {
      state.renewalError = false;
    },
  },
});

export const { setRefreshToken, removeRefreshToken, removeRenewalError } =
  refreshTokenSlice.actions;

export default refreshTokenSlice.reducer;
