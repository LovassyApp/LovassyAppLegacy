import { setControl } from "../store/slices/controlSlice";
import { setToken } from "../store/slices/tokenSlice";
import { useBlueboardClient } from "blueboard-client-react";
import { useDispatch } from "react-redux";
import useLogout from "./useLogout";

const useRenew = () => {
  const client = useBlueboardClient();
  const dispatch = useDispatch();

  const logout = useLogout();

  const renew = async (token) => {
    return client.renew.start(refreshCallback, errorCallback, token);
  };

  const errorCallback = async (err) => {
    console.error(err);
    logout(true);
  };

  const refreshCallback = async (res) => {
    const { token } = res;
    client.account.control(token).then((control) => {
      dispatch(setToken(res.token));
      dispatch(setControl(control));
      renew(res.rememberToken);
    });
  };

  return renew;
};

export default useRenew;
