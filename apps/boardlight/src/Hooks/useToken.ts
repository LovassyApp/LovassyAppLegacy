import { useSelector } from "react-redux";
import { RootState } from "../State";

export default function useToken(): string {
    return useSelector<RootState>((state: RootState) => state.token.token) as string;
}
