import { BlueboardClient } from "blueboard-client";
import { store } from "../../store/store";

export const eagerLoad = async (client: BlueboardClient, token?: string): Promise<void> => {
    const { dispatch } = store;

    dispatch({
        type: "loading/setMessage",
        payload: "Adatok betöltése...",
    });

    try {
        const res = await client.account.boot(true, token);

        dispatch({
            type: "coins/setCoins",
            payload: res.lolo?.coins,
        });

        dispatch({
            type: "control/setUserBalance",
            payload: res.lolo.balance,
        });

        dispatch({
            type: "kreta/setGrades",
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
