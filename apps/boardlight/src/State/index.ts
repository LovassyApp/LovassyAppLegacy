import { combineReducers, createStore } from 'redux';
import tokenReducer from './tokenReducer';
import controlReducer from './controlReducer';
import { saveState, loadState } from './sessionStorage';
import * as LocalStorage from './localStorage';
import loaderReducer from './loaderReducer';
import themeReducer from './themeReducer';
import settingsModalReducer from './settingsModalReducer';

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
