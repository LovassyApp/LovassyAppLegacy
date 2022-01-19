import { removeControl } from "../store/slices/controlSlice";
import { removeToken } from "../store/slices/tokenSlice";
import { useBlueboardClient } from "blueboard-client-react";
import { useDispatch } from "react-redux";
import { removeRefreshToken } from "../store/slices/refreshTokenSlice";
import { secureDeleteData } from "../utils/misc/storageUtils";

const useLogout = () => {
  const client = useBlueboardClient();
  const dispatch = useDispatch();

  return async (renewalError = false) => {
    client.renew.stop();
    await secureDeleteData("refreshToken");

    await client.auth.logout().then(() => {
      dispatch(removeToken(renewalError));
      dispatch(removeControl(renewalError));
      dispatch(removeRefreshToken(renewalError));
    });
  };
};

export default useLogout;
