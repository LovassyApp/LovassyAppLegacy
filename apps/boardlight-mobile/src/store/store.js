import { saveData, secureSaveData } from "../utils/misc/storageUtils";

import adminReducer from "./slices/adminSlice";
import { configureStore } from "@reduxjs/toolkit";
import controlReducer from "./slices/controlSlice";
import kretaReducer from "./slices/kretaSlice";
import loloReducer from "./slices/loloSlice";
import refreshTokenReducer from "./slices/refreshTokenSlice";
import themeReducer from "./slices/themeSlice";
import tokenReducer from "./slices/tokenSlice";

const store = configureStore({
  reducer: {
    token: tokenReducer,
    refreshToken: refreshTokenReducer,
    control: controlReducer,
    lolo: loloReducer,
    admin: adminReducer,
    theme: themeReducer,
    kreta: kretaReducer,
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
