import controlReducer, { controlInitialState } from "./slices/controlSlice";
import refreshTokenReducer, { refreshTokenInitialState } from "./slices/refreshTokenSlice";
import { saveData, secureSaveData } from "../utils/misc/storageUtils";
import settingsReducer, { settingsInitialState } from "./slices/settingsSlice";
import tokenReducer, { tokenInitialState } from "./slices/tokenSlice";

import coinsReducer from "./slices/coinsSlice";
import { configureStore } from "@reduxjs/toolkit";
import inventoryReducer from "./slices/inventorySlice";
import kretaReducer from "./slices/kretaSlice";
import loadingReducer from "./slices/loadingSlice";
import requestsReducer from "./slices/requestsSlice";
import storeReducer from "./slices/storeSlice";

const store = configureStore({
  reducer: {
    token: tokenReducer,
    refreshToken: refreshTokenReducer,
    control: controlReducer,
    coins: coinsReducer,
    settings: settingsReducer,
    kreta: kretaReducer,
    loading: loadingReducer,
    store: storeReducer,
    inventory: inventoryReducer,
    requests: requestsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

store.subscribe(async () => {
  if (store.getState().settings !== settingsInitialState) {
    saveData("settings", store.getState().settings);
  }
  if (store.getState().token !== tokenInitialState) {
    secureSaveData("token", store.getState().token);
  }
  if (store.getState().refreshToken !== refreshTokenInitialState) {
    secureSaveData("refreshToken", store.getState().refreshToken);
  }
  if (store.getState().control !== controlInitialState) {
    secureSaveData("control", store.getState().control);
  }
});
