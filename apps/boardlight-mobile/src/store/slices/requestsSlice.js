import { createSlice } from "@reduxjs/toolkit";

export const requestsSlice = createSlice({
  name: "requests",
  initialState: {
    value: null,
  },
  reducers: {
    setRequests: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setRequests } = requestsSlice.actions;

export default requestsSlice.reducer;
