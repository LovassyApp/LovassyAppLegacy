import store from "../../store/store";

export const eagerLoad = async (client, token) => {
  console.log("DEBUG: Eager loading data...");
  const { dispatch } = store;

  try {
    const res = await client.account.boot(true, token);

    dispatch({
      type: "coins/setCoins",
      payload: res.lolo?.coins ?? [],
    });

    // this is only here because it shouldn't set balance to null even tho you don't have perms to see the coins
    if (res.lolo) {
      dispatch({
        type: "control/setUserBalance",
        payload: res.lolo.balance,
      });
    }

    dispatch({
      type: "kreta/setGradeValue",
      payload: res.grades ?? [],
    });

    dispatch({
      type: "store/setStore",
      payload: res.store ?? [],
    });

    dispatch({
      type: "inventory/setInventory",
      payload: res.inventory ?? [],
    });

    dispatch({
      type: "requests/setRequests",
      payload: res.requests ?? [],
    });
  } catch (err) {
    console.log(err);
  }
};
