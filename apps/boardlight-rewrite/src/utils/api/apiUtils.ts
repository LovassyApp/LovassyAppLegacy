import { BlueboardClient } from "blueboard-client";
import { store } from "../../store/store";

export const fetchLolo = async (
    client: BlueboardClient,
    refresh = true,
    token: string = null,
): Promise<void> => {
    const { dispatch } = store;

    console.log("DEBUG: Fetching lolo...");

    try {
        const res = await client.lolo.get(refresh, token);

        dispatch({
            type: "coins/setCoins",
            payload: res.coins,
        });

        dispatch({
            type: "control/setUserBalance",
            payload: res.balance,
        });
    } catch (err) {
        console.log(err);
    }
};

export const fetchGrades = async (
    client: BlueboardClient,
    refresh = true,
    token: string = null,
): Promise<void> => {
    const { dispatch } = store;

    console.log("DEBUG: Fetching grades...");

    try {
        const res = await client.kreta.grades(refresh, token);

        dispatch({
            type: "kreta/setGrades",
            payload: res,
        });
    } catch (err) {
        console.log(err);
    }
};

export const fetchStore = async (client: BlueboardClient, token: string = null): Promise<void> => {
    const { dispatch } = store;

    console.log("DEBUG: Fetching store...");

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

export const fetchInventory = async (
    client: BlueboardClient,
    token: string = null,
): Promise<void> => {
    const { dispatch } = store;

    console.log("DEBUG: Fetching inventory...");

    try {
        const res = await client.inventory.items(token);

        dispatch({
            type: "inventory/setInventory",
            payload: res,
        });
    } catch (err) {
        console.log(err);
    }
};

export const fetchRequests = async (
    client: BlueboardClient,
    token: string = null,
): Promise<void> => {
    const { dispatch } = store;

    console.log("DEBUG: Fetching requests...");

    try {
        const res = await client.lolo_request.get(token);

        dispatch({
            type: "requests/setRequests",
            payload: res,
        });
    } catch (err) {
        console.log(err);
    }
};
