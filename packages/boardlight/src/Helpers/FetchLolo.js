import axios from 'axios';
import token from '../Utils/Token';
import Endpoints from '../Utils/Endpoints';
import AxiosErrorToast from '../Utils/AxiosErrorToast';

const fetchLolo = async () => {
	const url = Endpoints.base + Endpoints.loloBase;

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

export default fetchLolo;
