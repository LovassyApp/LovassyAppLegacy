import * as React from 'react';
import { useSelector } from 'react-redux';
import useToken from '../Hooks/useToken';
import Four0Three from '../Pages/403';

const Middleware = ({ permission, displayError = false, component }) => {
	if (permission == undefined) {
		throw Error('No permission supplied.');
	}

	const token = useToken();
	const permissions = useSelector((state) => state.control.control.permissions) ?? [];
	const canAccess = checkPermission(permission, permissions);

	if (token == undefined) {
		return <>{component}</>;
	}

	return <>{canAccess ? component : <>{displayError ? <Four0Three /> : null}</>}</>;
};

const checkPermission = (permString, permissions) => {
	const canAccess = permissions.includes(permString);

	return canAccess;
};

export { checkPermission };

export default Middleware;
