import { saveData, secureSaveData } from "../utils/misc/storageUtils";

import adminReducer from "./slices/adminSlice";
import { configureStore } from "@reduxjs/toolkit";
import controlReducer from "./slices/controlSlice";
import loloReducer from "./slices/loloSlice";
import themeReducer from "./slices/themeSlice";
import tokenReducer from "./slices/tokenSlice";
import refreshTokenSlice from "./slices/refreshTokenSlice";

const store = configureStore({
  reducer: {
    token: tokenReducer,
    refreshToken: refreshTokenSlice,
    control: controlReducer,
    lolo: loloReducer,
    admin: adminReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

store.subscribe(async () => {
  secureSaveData("token", store.getState().token);
  secureSaveData("refreshToken", store.getState().refreshToken);
  saveData("control", store.getState().control);
});
