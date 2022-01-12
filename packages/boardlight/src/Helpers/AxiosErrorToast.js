import toast from 'react-hot-toast';

const AxiosErrorToast = async (error) => {
	try {
		toast.error(error.response.data.message + ' (' + error.response.status + ')');
	} catch (error) {
		toast.error('Generic error.');
	}
};

export default AxiosErrorToast;
