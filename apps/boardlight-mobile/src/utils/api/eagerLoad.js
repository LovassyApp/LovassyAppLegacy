import { fetchGrades, fetchLolo } from "./apiUtils";

export const eagerLoad = async (client, token) => {
  console.log("DEBUG: Eager loading data...");
  if (token) {
    await Promise.all([fetchLolo(client, true, token), fetchGrades(client, true, token)]);
  } else {
    await Promise.all([fetchLolo(client), fetchGrades(client)]);
  }
};
