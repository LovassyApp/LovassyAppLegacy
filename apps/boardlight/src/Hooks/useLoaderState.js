import { useSelector } from 'react-redux';

export default function useLoaderState() {
	return useSelector((state) => state.loader.loader);
}
