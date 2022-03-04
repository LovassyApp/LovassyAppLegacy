import { fetchGrades, fetchInventory, fetchLolo, fetchRequests, fetchStore } from "./apiUtils";

import { BlueboardClient } from "blueboard-client";
import { store } from "../../store/store";

export const eagerLoad = async (client: BlueboardClient, token?: string): Promise<void> => {
    const { dispatch } = store;

    dispatch({
        type: "loading/setMessage",
        payload: "Loló betöltése...",
    });

    await fetchLolo(client, true, token);

    dispatch({
        type: "loading/setMessage",
        payload: "Jegyek betöltése...",
    });

    await fetchGrades(client, false, token);

    dispatch({
        type: "loading/setMessage",
        payload: "Áruház betöltése...",
    });

    await fetchStore(client, token);

    dispatch({
        type: "loading/setMessage",
        payload: "Kincstár betöltése...",
    });

    await fetchInventory(client, token);

    dispatch({
        type: "loading/setMessage",
        payload: "Kérvények betöltése...",
    });

    await fetchRequests(client, token);
};
