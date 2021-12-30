import { combineReducers, createStore } from 'redux';
import tokenReducer from './tokenReducer';
import controlReducer from './controlReducer';
import { saveState, loadState } from './sessionStorage';
import loaderReducer from './loaderReducer';
import themeReducer from './themeReducer';

const rootReducer = combineReducers({
	token: tokenReducer,
	control: controlReducer,
	loader: loaderReducer,
	theme: themeReducer,
});

const persistedState = loadState();

const store = createStore(rootReducer, persistedState);

store.subscribe(() => {
	saveState(store.getState());
});

export default store;
