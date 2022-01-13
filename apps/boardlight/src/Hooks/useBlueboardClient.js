import { useContext } from 'react';
import { BlueboardClientContext } from '../Providers/BlueboardClientProvider';

const useBlueboardClient = () => {
	return useContext(BlueboardClientContext);
};

export default useBlueboardClient;
