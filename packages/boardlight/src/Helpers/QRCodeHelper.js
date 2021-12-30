import axios from 'axios';
import token from '../Utils/Token';
import Endpoints from '../Utils/Endpoints';
import AxiosErrorToast from '../Utils/AxiosErrorToast';

const fetchCodes = async () => {
	const url = Endpoints.base + Endpoints.qrcodes;
	var config = {
		method: 'get',
		url: url,
		headers: {
			Authorization: 'Bearer ' + token(),
		},
	};

	const res = await axios(config).catch((err) => {
		console.error(err);
		AxiosErrorToast(err);
		throw err;
	});

	return res.data.data;
};

const makeCode = async (name) => {
	const url = Endpoints.base + Endpoints.qrcodes;

	var config = {
		method: 'post',
		url: url,
		headers: {
			Authorization: 'Bearer ' + token(),
		},
		data: {
			name: name,
		},
	};

	const res = await axios(config).catch((err) => {
		console.error(err);
		AxiosErrorToast(err);
		throw err;
	});

	return res.data.data;
};

const deleteCode = async (id) => {
	const url = Endpoints.base + Endpoints.qrcodes;
	var config = {
		method: 'delete',
		url: url,
		data: { id: id },
		headers: {
			Authorization: 'Bearer ' + token(),
		},
	};

	const res = await axios(config).catch((err) => {
		console.error(err);
		AxiosErrorToast(err);
		throw err;
	});

	return res;
};

export { fetchCodes, makeCode, deleteCode };
