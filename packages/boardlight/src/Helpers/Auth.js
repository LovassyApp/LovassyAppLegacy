import axios from 'axios';
import Endpoints from '../Utils/Endpoints';
import store from '../State';
import qs from 'qs';

async function attemptLogin(username, password, remember) {
	const url = Endpoints.base + Endpoints.login;

	var data = qs.stringify({
		email: username,
		password: password,
		remember: Number(remember),
	});

	var config = {
		method: 'post',
		url: url,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		data: data,
	};

	return await axios(config)
		.then((res) => {
			if (res.data.message === 'Invalid Credentials') {
				throw Error('Invalid password or e-mail address');
			}
			return res;
		})
		.catch((err) => {
			console.error(err);
			throw err;
		});
}

const bootstrapToken = async (report = false) => {
	const url = Endpoints.base + Endpoints.login;
	var config = {
		method: 'get',
		url: url,
	};

	var res = await axios(config).catch((err) => {
		if (report) {
			throw err;
		}
	});
	if (res !== undefined) {
		//dispatch({ type: 'token/setToken', payload: res.data.token });
		return res;
	}
};

const logout = async () => {
	const dispatch = store.dispatch;
	dispatch({ type: 'loader/forceLoader' });
	const url = Endpoints.base + Endpoints.logout;
	var config = {
		method: 'get',
		url: url,
	};

	axios(config).then(() => {
		dispatch({ type: 'token/removeToken' });
		dispatch({ type: 'control/removeControl' });
		dispatch({ type: 'loader/removeLoader' });
	});
};

export { attemptLogin, bootstrapToken, logout };
