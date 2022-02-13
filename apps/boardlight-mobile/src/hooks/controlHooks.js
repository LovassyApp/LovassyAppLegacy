import { useSelector } from "react-redux";

export const useControl = () => {
  return useSelector((state) => state.control.value);
};

export const usePermissions = () => {
  const control = useControl();

  return control !== null ? control.permissions : [];
};

export const useUser = () => {
  const control = useControl();

  return control !== null ? control.user : {};
};

export const useGroups = () => {
  const control = useControl();

  return control !== null ? control.groups : [];
};
