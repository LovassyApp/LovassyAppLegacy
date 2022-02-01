import { setLoading } from "../store/slices/loadingSlice";
import { useDispatch } from "react-redux";

export const useLoading = () => {
  const dispatch = useDispatch();

  return (value) => {
    dispatch(setLoading(value));
  };
};
