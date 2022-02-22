import { useSelector } from "react-redux";
import { RootState } from "../State";

export default function useLoaderState(): boolean {
    return useSelector<RootState>((state) => state.loader.loader) as boolean;
}
