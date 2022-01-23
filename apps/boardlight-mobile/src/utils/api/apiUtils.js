import store from "../../store/store";

export const fetchLolo = async (client, refresh = true, token = null) => {
  const { dispatch } = store;

  try {
    const res = await client.lolo.get(refresh, token);

    dispatch({
      type: "lolo/setLolo",
      payload: res,
    });
  } catch (err) {
    console.log(err);
  }
};
