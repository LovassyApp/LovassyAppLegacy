import { removeControl } from "../store/slices/controlSlice";
import { removeToken } from "../store/slices/tokenSlice";
import { useBlueboardClient } from "blueboard-client-react";
import { useDispatch } from "react-redux";

const useLogout = () => {
  const client = useBlueboardClient();
  const dispatch = useDispatch();

  return async (renewalError = false) => {
    client.renew.stop();
    await client.auth.logout().then(() => {
      dispatch(removeToken());
      dispatch(removeControl(renewalError));
    });
  };
};

export default useLogout;
