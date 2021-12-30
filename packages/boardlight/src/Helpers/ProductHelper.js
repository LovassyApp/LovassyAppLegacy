import axios from 'axios';
import token from '../Utils/Token';
import Endpoints from '../Utils/Endpoints';
import AxiosErrorToast from '../Utils/AxiosErrorToast';

const fetchProducts = async () => {
	const url = Endpoints.base + Endpoints.products;

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

const fetchProduct = async (id) => {
	const url = Endpoints.base + Endpoints.products + `/${id}`;

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

const saveProduct = async (data) => {
	const url = Endpoints.base + Endpoints.products;
	var config = {
		method: data.id === 'new' ? 'put' : 'patch',
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

const deleteProduct = async (id) => {
	const url = Endpoints.base + Endpoints.products;
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

export { fetchProducts, saveProduct, fetchProduct, deleteProduct };
