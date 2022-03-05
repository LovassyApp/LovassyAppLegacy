import { BlueboardControl, BlueboardUser, BlueboardUserGroup } from "blueboard-client";

import { RootState } from "../store/store";
import { useSelector } from "react-redux";

export const useControl = (): BlueboardControl => {
    return useSelector((state: RootState) => state.control.value);
};

export const usePermissions = (): string[] => {
    const control = useControl();

    return control !== null ? control.permissions : [];
};

export const useUser = (): BlueboardUser => {
    const control = useControl();

    return control !== null ? control.user : ({} as BlueboardUser);
};

export const useGroups = (): BlueboardUserGroup[] => {
    const control = useControl();

    return control !== null ? control.groups : [];
};
