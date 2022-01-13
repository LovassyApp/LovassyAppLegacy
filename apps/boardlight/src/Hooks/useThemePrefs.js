import { useSelector } from 'react-redux';

export default function useThemePrefs() {
	return useSelector((state) => state.theme);
}
