import axios from 'axios';
import Endpoints from '../Utils/Endpoints';
import store from '../State';
import { bootstrapToken, logout } from './Auth';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

var error = false;
var timeout;

const entry = async (tokenParam = null) => {
	const state = store.getState();
	const token = tokenParam ?? state.token.token;
	if (token === null && error === false) {
		clearInterval(timeout);
		return false;
	} else {
		error = false;
		return await fetchControl(token).then((res) => {
			const state = store.getState();
			var control = state.control.control;
			var timeout = (control.session.expiry - Math.floor(Date.now() / 1000) - 2) * 1000;
			console.log('DEBUG: Token expiry thread sleep: ' + timeout / 1000 + ' seconds.');
			timeout = setInterval(callback, timeout);
			return res;
		});
	}
};

const callback = () => {
	const dispatch = store.dispatch;
	console.log('DEBUG: Renewing token...');
	bootstrapToken(true)
		.then((res) => dispatch({ type: 'token/setToken', payload: res.data.token }))
		.catch((err) => {
			clearInterval(timeout);
			error = true;
			logout().then(() => {
				Swal.fire({
					title: 'Probléma!',
					text: 'Hú csávókám hát, ez nagyon lent van, hogy kilettél rakva innen.',
					icon: 'error',
					confirmButtonText: 'többet nem fordul elő...',
				});
			});
		});
};

const fetchControl = async (token) => {
	const dispatch = store.dispatch;
	const url = Endpoints.base + Endpoints.control;
	var config = {
		method: 'get',
		url: url,
		headers: {
			Authorization: 'Bearer ' + token,
		},
	};

	var res = await axios(config).catch((err) => {
		toast.error('Control fetching error! Try again later.');
		dispatch({ type: 'token/removeToken' });
		throw err;
	});

	dispatch({ type: 'control/setControl', payload: res.data });

	return res;
};

export default entry;

export { callback };
