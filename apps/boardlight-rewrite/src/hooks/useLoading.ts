import { useDispatch } from "react-redux";
import { setLoading, setMessage } from "../store/slices/loadingSlice";

export const useLoading = (): ((value: boolean, message: string) => void) => {
    const dispatch = useDispatch();

    return (value: boolean, message: string) => {
        dispatch(setLoading(value));
        dispatch(setMessage(message));
    };
};
