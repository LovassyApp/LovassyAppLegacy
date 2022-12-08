import { Dimensions } from "react-native";

export const getOffset = (offsetBase) => {
  return offsetBase - Dimensions.get("window").height * 0.01;
};
