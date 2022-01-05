import { useContext } from "react";
import { BlueboardClientContext } from "../Providers/BlueboardClientProvider";

export const useBlueboardClient = () => {
  return useContext(BlueboardClientContext);
};
