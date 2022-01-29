import { BlueboardControl, BlueboardUser } from 'blueboard-client';
import { useSelector } from 'react-redux';
import { RootState } from '../State';

const usePermissions = (): String[] => {
    const control = useControl();

    return control !== null ? control.permissions : [];
};

const useControl = (): BlueboardControl => {
    return useSelector<RootState>((state: RootState) => state.control.control) as BlueboardControl;
};

const useUser = (): BlueboardUser => {
    const control = useControl();

    return control !== null ? control.user : ({} as BlueboardUser);
};

export { usePermissions, useControl, useUser };
