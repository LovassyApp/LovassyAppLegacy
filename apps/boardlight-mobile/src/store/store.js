import { saveData, secureSaveData } from "../utils/misc/storageUtils";

import coinsReducer from "./slices/coinsSlice";
import { configureStore } from "@reduxjs/toolkit";
import controlReducer from "./slices/controlSlice";
import inventoryReducer from "./slices/inventorySlice";
import kretaReducer from "./slices/kretaSlice";
import loadingReducer from "./slices/loadingSlice";
import refreshTokenReducer from "./slices/refreshTokenSlice";
import settingsReducer from "./slices/settingsSlice";
import requestsReducer from "./slices/requestsSlice";
import storeReducer from "./slices/storeSlice";
import tokenReducer from "./slices/tokenSlice";

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
  saveData("settings", store.getState().settings);
  secureSaveData("token", store.getState().token);
  secureSaveData("refreshToken", store.getState().refreshToken);
  saveData("control", store.getState().control);
});
