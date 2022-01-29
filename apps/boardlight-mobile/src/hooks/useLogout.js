import { removeControl } from "../store/slices/controlSlice";
import { removeRefreshToken } from "../store/slices/refreshTokenSlice";
import { removeToken } from "../store/slices/tokenSlice";
import { secureDeleteData } from "../utils/misc/storageUtils";
import { useBlueboardClient } from "blueboard-client-react";
import { useDispatch } from "react-redux";

const useLogout = () => {
  const client = useBlueboardClient();
  const dispatch = useDispatch();

  return async (renewalError = false) => {
    client.renew.stop();
    await secureDeleteData("refreshToken");

    await client.auth.logout().then(() => {
      dispatch(removeToken(renewalError));
      dispatch(removeControl(renewalError));
      dispatch(removeRefreshToken());
    });
  };
};

export default useLogout;
