import { createSlice } from "@reduxjs/toolkit";

export const controlInitialState = {
  value: null,
};

export const controlSlice = createSlice({
  name: "control",
  initialState: controlInitialState,
  reducers: {
    setControl: (state, action) => {
      state.value = action.payload;
    },
    removeControl: (state) => {
      state.value = null;
    },
    setGroups: (state, action) => {
      const newPermissions = [
        ...new Set(action.payload.map((element) => element.permissions).flat()),
      ];

      const newControl = {
        ...state.value,
        groups: action.payload,
        permissions: newPermissions,
      };

      state.value = newControl;
    },
    setUser: (state, action) => {
      const newControl = {
        ...state.value,
        user: action.payload,
      };

      state.value = newControl;
    },
    setUserBalance: (state, action) => {
      const newControl = {
        ...state.value,
        user: {
          ...state.value.user,
          balance: action.payload,
        },
      };
      state.value = newControl;
    },
  },
});

export const { setControl, removeControl, setGroups, setUser, setUserBalance } =
  controlSlice.actions;

export default controlSlice.reducer;
