import { removeControl } from "../store/slices/controlSlice";
import { removeRefreshToken } from "../store/slices/refreshTokenSlice";
import { removeToken } from "../store/slices/tokenSlice";
import { secureDeleteData } from "../utils/misc/storageUtils";
import { useBlueboardClient } from "blueboard-client-react";
import { useDispatch } from "react-redux";
import { useLoading } from "./useLoading";

const useLogout = () => {
  const client = useBlueboardClient();
  const dispatch = useDispatch();
  const loading = useLoading();

  return async (renewalError = false) => {
    loading(true);
    client.renew.stop();
    await secureDeleteData("refreshToken");

    await client.auth.logout().then(() => {
      dispatch(removeToken(renewalError));
      dispatch(removeControl(renewalError));
      dispatch(removeRefreshToken());
    });
    loading(false);
  };
};

export default useLogout;
