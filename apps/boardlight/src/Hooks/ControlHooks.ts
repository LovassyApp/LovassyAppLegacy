import { BlueboardControl, BlueboardUser, BlueboardUserGroup } from "blueboard-client";
import { useSelector } from "react-redux";
import { RootState } from "../State";

const usePermissions = (): string[] => {
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

const useGroups = (): BlueboardUserGroup[] => {
    const control = useControl();

    return control !== null ? control.groups : [];
};

export { usePermissions, useControl, useUser, useGroups };
