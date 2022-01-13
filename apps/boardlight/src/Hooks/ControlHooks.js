import { useSelector } from 'react-redux';

const usePermissions = () => {
	const control = useControl();

	return control !== null ? control.permissions : [];
};

const useControl = () => {
	return useSelector((state) => state.control.control);
};

const useUser = () => {
	const control = useControl();

	return control !== null ? control.user : {};
};

export { usePermissions, useControl, useUser };
