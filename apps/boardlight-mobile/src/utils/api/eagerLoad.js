import { fetchGrades, fetchInventory, fetchLolo, fetchRequests, fetchStore } from "./apiUtils";

export const eagerLoad = async (client, token) => {
  console.log("DEBUG: Eager loading data...");
  if (token) {
    await fetchLolo(client, true, token);

    await Promise.all([
      fetchGrades(client, false, token),
      fetchStore(client, token),
      fetchInventory(client, token),
      fetchRequests(client, token),
    ]);
  } else {
    await fetchLolo(client, true);

    await Promise.all([
      fetchGrades(client),
      fetchStore(client),
      fetchInventory(client),
      fetchRequests(client),
    ]);
  }
};
