/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable no-underscore-dangle */
import { combineReducers, createStore } from "@reduxjs/toolkit";

import coinsReducer from "./slices/coinsSlice";
import controlReducer from "./slices/controlSlice";
import inventoryReducer from "./slices/inventorySlice";
import kretaReducer from "./slices/kretaSlice";
import loadingReducer from "./slices/loadingSlice";
import { persistReducer } from "redux-persist";
import requestsReducer from "./slices/requestsSlice";
import settingsReducer from "./slices/settingsSlice";
import storage from "redux-persist/lib/storage";
import storeReducer from "./slices/storeSlice";
import tokenReducer from "./slices/tokenSlice";

const persistConfig = {
    key: "boardlight_rewrite",
    storage,
    blacklist: ["control", "loading", "token", "requests", "store", "coins", "kreta", "inventory"],
};

const rootReducer = combineReducers({
    token: tokenReducer,
    settings: settingsReducer,
    control: controlReducer,
    loading: loadingReducer,
    requests: requestsReducer,
    invetory: inventoryReducer,
    store: storeReducer,
    kreta: kretaReducer,
    coins: coinsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
    persistedReducer,
    // @ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
