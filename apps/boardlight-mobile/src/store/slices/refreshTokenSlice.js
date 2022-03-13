import { createSlice } from "@reduxjs/toolkit";

export const refreshTokenInitialState = {
  value: null,
};

export const refreshTokenSlice = createSlice({
  name: "refreshToken",
  initialState: refreshTokenInitialState,
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
