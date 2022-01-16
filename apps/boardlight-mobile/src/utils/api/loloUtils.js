import { Endpoints } from "./endpionts";
import axios from "axios";
import store from "../../store/store";

export const fetchLolo = async (token, refresh) => {
  const { dispatch } = store;
  const url = Endpoints.base + Endpoints.loloBase;

  const config = {
    method: "get",
    url: url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      refresh: refresh,
    },
  };

  const res = await axios(config);

  dispatch({
    type: "lolo/setLolo",
    payload: { bal: res.data.data.balance, coins: res.data.data.coins },
  });
};
