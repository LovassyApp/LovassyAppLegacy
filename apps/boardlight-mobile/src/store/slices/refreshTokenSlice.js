import { createSlice } from "@reduxjs/toolkit";

export const refreshTokenSlice = createSlice({
  name: "refreshToken",
  initialState: {
    value: null,
  },
  reducers: {
    setRefreshToken: (state, action) => {
      state.value = action.payload;
    },
    removeRefreshToken: (state) => {
      state.value = null;
    },
  },
});

export const { setRefreshToken, removeRefreshToken, removeRenewalError } =
  refreshTokenSlice.actions;

export default refreshTokenSlice.reducer;
