import { fetchCoins, fetchGrades, fetchStore } from "./apiUtils";

export const eagerLoad = async (client, token) => {
  console.log("DEBUG: Eager loading data...");
  if (token) {
    await Promise.all([
      fetchCoins(client, true, token),
      fetchGrades(client, false, token),
      fetchStore(client, token),
    ]);
  } else {
    await Promise.all([fetchCoins(client), fetchGrades(client), fetchStore(client)]);
  }
};
