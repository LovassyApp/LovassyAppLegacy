import { createSlice } from "@reduxjs/toolkit";

export const loadingInitialState = {
  value: false,
};

export const loadingSlice = createSlice({
  name: "loading",
  initialState: loadingInitialState,
  reducers: {
    setLoading: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setLoading } = loadingSlice.actions;

export default loadingSlice.reducer;
