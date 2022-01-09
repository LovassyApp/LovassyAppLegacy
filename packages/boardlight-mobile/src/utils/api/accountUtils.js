import { Endpoints } from "./endpionts";
import axios from "axios";
import { secureLoadData } from "../../../../../../../Downloads/LovassyApp-master/packages/boardlight-mobile/src/utils/misc/storageUtils";
import store from "../../../../../../../Downloads/LovassyApp-master/packages/boardlight-mobile/src/store/store";

var interval;

export const setRenewal = (tokenParam = null) => {
  const state = store.getState();
  const token = tokenParam ?? state.token.value;

  if (token === null) {
    clearInterval(interval);
  } else {
    fetchControl(token).then(() => {
      var control = state.control.value;
      var timeout = (control.session.expiry - Math.floor(Date.now() / 1000) - 2) * 1000;
      console.log(`DEBUG: Token expiry thread sleep: ${timeout / 1000}`);
      interval = setInterval(callback, timeout);
    });
  }
};

export const clearRenewal = () => {
  if (interval !== null) {
    clearInterval(interval);
  }
};

const callback = async () => {
  const { dispatch } = store;

  const email = await secureLoadData("email");
  const password = await secureLoadData("password");

  console.log("DEBUG: Renewing token");

  try {
    const res = await login(email, password);

    dispatch({ type: "token/setToken", payload: res.data.token });
  } catch (err) {
    clearInterval(interval);

    dispatch({ type: "token/removeToken", payload: true });
    dispatch({ type: "control/removeControl" });
  }
};

export const fetchControl = async (token) => {
  const { dispatch } = store;
  const url = Endpoints.base + Endpoints.control;

  const config = {
    method: "get",
    url: url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await axios(config);

    dispatch({ type: "control/setControl", payload: res.data });

    return res;
  } catch (err) {
    dispatch({ type: "token/removeToken" });

    throw err;
  }
};

// must fetch control afterwards and save token + credentials
export const login = async (email, password) => {
  const url = Endpoints.base + Endpoints.login;

  const data = {
    email: email,
    password: password,
    remember: 0,
  };

  const config = {
    method: "post",
    url: url,
    data: data,
  };

  return await axios(config);
};

export const register = async (email, password, kretaUsername, kretaPassword) => {
  const url = Endpoints.base + Endpoints.register;

  var data = {
    email: email,
    password: password,
    kreta_username: kretaUsername,
    kreta_password: kretaPassword,
  };

  var config = {
    method: "post",
    url: url,
    data: data,
  };

  return await axios(config);
};
