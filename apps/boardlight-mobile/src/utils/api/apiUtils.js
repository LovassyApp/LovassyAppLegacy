import store from "../../store/store";

export const fetchLolo = async (client) => {
  const { dispatch } = store;

  try {
    const res = await client.lolo.get(true);

    dispatch({
      type: "lolo/setLolo",
      payload: res,
    });
  } catch (err) {
    console.log(err);
  }
};
