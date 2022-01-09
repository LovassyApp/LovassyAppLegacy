import { useContext } from "react";
import { BlueboardClientContext } from "../providers/blueboardClientProvider";

export const useBlueboardClient = () => {
  return useContext(BlueboardClientContext);
};
