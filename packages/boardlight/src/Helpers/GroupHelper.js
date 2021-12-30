import axios from 'axios';
import token from '../Utils/Token';
import Endpoints from '../Utils/Endpoints';
import AxiosErrorToast from '../Utils/AxiosErrorToast';
//import { success } from "../Utils/Logger";

const fetchGroups = async () => {
	const url = Endpoints.base + Endpoints.permissions.groups;
	//success('Url: ' + url, fetchGroups);
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

const getAllPermissions = async () => {
	const url = Endpoints.base + Endpoints.permissions.list;
	//success('Url: ' + url, getAllPermissions);
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

const saveGroup = async (data) => {
	const url = Endpoints.base + Endpoints.permissions.groups;
	//success('Url: ' + url, getAllPermissions);
	var config = {
		method: data.id === 'new' ? 'post' : 'patch',
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

const getGroup = async (id) => {
	const url = Endpoints.base + Endpoints.permissions.groups + '/' + Number(id);
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

const deleteGroup = async (id) => {
	const url = Endpoints.base + Endpoints.permissions.groups;
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

export { fetchGroups, getAllPermissions, saveGroup, getGroup, deleteGroup };
