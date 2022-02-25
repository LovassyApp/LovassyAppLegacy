import { combineReducers, createStore } from "@reduxjs/toolkit";

import controlReducer from "./slices/controlSlice";
import loadingReducer from "./slices/loadingSlice";
import { persistReducer } from "redux-persist";
import settingsReducer from "./slices/settingsSlice";
import storage from "redux-persist/lib/storage";
import tokenReducer from "./slices/tokenSlice";

const persistConfig = {
    key: "boardlight_rewrite",
    storage,
    blacklist: ["control", "loading", "token"],
};

const rootReducer = combineReducers({
    token: tokenReducer,
    settings: settingsReducer,
    control: controlReducer,
    loading: loadingReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
