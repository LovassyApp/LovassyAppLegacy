import * as React from 'react';
import { usePermissions } from '../Hooks/ControlHooks';
import useToken from '../Hooks/useToken';
import Four0Three from '../Pages/403';

const Middleware = ({
    permission,
    component,
    displayError = false,
}: {
    permission: string;
    component: React.ReactNode;
    displayError?: boolean;
}): JSX.Element => {
    if (permission === undefined) {
        throw Error('No permission supplied.');
    }

    const token = useToken();
    const permissions = usePermissions();
    const canAccess = checkPermission(permission, permissions);

    if (token === undefined) {
        return <>{component}</>;
    }

    return <>{canAccess ? component : <>{displayError ? <Four0Three /> : null}</>}</>;
};

const checkPermission = (permString: string, permissions: String[]) => {
    const canAccess = permissions.includes(permString);

    return canAccess;
};

export { checkPermission };

export default Middleware;
