import axios from 'axios';
import token from '../Utils/Token';
import Endpoints from '../Utils/Endpoints';
import AxiosErrorToast from '../Utils/AxiosErrorToast';

const fetchUsers = async () => {
	const url = Endpoints.base + Endpoints.users;
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

const fetchUser = async (id) => {
	const url = Endpoints.base + Endpoints.users + '/' + Number(id);

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

const updateUser = async (data) => {
	const url = Endpoints.base + Endpoints.users;
	var config = {
		method: 'patch',
		url: url,
		data: data,
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

const deleteUser = async (id) => {
	const url = Endpoints.base + Endpoints.users;
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

export { fetchUsers, fetchUser, updateUser, deleteUser };
