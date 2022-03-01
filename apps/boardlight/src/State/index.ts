import * as LocalStorage from './localStorage';

import { combineReducers, createStore } from 'redux';
import { loadState, saveState } from './sessionStorage';

import controlReducer from './controlReducer';
import loaderReducer from './loaderReducer';
import settingsModalReducer from './settingsModalReducer';
import themeReducer from './themeReducer';
import tokenReducer from './tokenReducer';

const rootReducer = combineReducers({
    token: tokenReducer,
    control: controlReducer,
    loader: loaderReducer,
    theme: themeReducer,
    settingsModal: settingsModalReducer,
});

const persistedState: any = { ...loadState(), ...LocalStorage.loadState() };

const store = createStore(rootReducer, persistedState);

store.subscribe(() => {
    saveState(store.getState());
    LocalStorage.saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
