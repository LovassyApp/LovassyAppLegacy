import store from '../State';

const token = () => {
	const state = store.getState();
	return state.token.token ?? null;
};

export default token;
