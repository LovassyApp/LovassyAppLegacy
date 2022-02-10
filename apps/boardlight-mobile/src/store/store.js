import { saveData, secureSaveData } from "../utils/misc/storageUtils";

import { configureStore } from "@reduxjs/toolkit";
import controlReducer from "./slices/controlSlice";
import kretaReducer from "./slices/kretaSlice";
import loadingReducer from "./slices/loadingSlice";
import loloReducer from "./slices/loloSlice";
import refreshTokenReducer from "./slices/refreshTokenSlice";
import settingsReducer from "./slices/settingsSlice";
import storeReducer from "./slices/storeSlice";
import tokenReducer from "./slices/tokenSlice";

const store = configureStore({
  reducer: {
    token: tokenReducer,
    refreshToken: refreshTokenReducer,
    control: controlReducer,
    lolo: loloReducer,
    settings: settingsReducer,
    kreta: kretaReducer,
    loading: loadingReducer,
    store: storeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

store.subscribe(async () => {
  saveData("settings", store.getState().settings);
  secureSaveData("token", store.getState().token);
  secureSaveData("refreshToken", store.getState().refreshToken);
  saveData("control", store.getState().control);
});
