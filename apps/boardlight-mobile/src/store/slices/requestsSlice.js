import { createSlice } from "@reduxjs/toolkit";

export const requestsInitialState = {
  value: null,
};

export const requestsSlice = createSlice({
  name: "requests",
  initialState: requestsInitialState,
  reducers: {
    setRequests: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setRequests } = requestsSlice.actions;

export default requestsSlice.reducer;
