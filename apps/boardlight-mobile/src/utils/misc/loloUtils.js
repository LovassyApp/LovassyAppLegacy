import { BlueboardLoloReason } from "blueboard-client";

export const getCoinsFromGrades = (coins) => {
  var res = 0;

  for (const coin of coins) {
    if (
      coin.reason === BlueboardLoloReason.FromFive ||
      coin.reason === BlueboardLoloReason.FromFour
    ) {
      res++;
    }
  }

  return res;
};

export const getCoinsFromRequests = (coins) => {
  var res = 0;

  for (const coin of coins) {
    if (coin.reason === BlueboardLoloReason.FromRequest) {
      res++;
    }
  }

  return res;
};

export const getTotalSpendings = (coins) => {
  var res = 0;

  for (const coin of coins) {
    if (coin.isSpent) {
      res++;
    }
  }

  return res;
};
