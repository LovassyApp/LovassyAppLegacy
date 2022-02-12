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

export const fetchGrades = async (client, refresh = true, token = null) => {
  const { dispatch } = store;

  try {
    const res = await client.kreta.grades(refresh, token);

    dispatch({
      type: "kreta/setGradeValue",
      payload: res,
    });
  } catch (err) {
    console.log(err);
  }
};

export const fetchStore = async (client, token = null) => {
  const { dispatch } = store;

  try {
    const res = await client.store.all(token);

    dispatch({
      type: "store/setStore",
      payload: res,
    });
  } catch (err) {
    console.log(err);
  }
};
