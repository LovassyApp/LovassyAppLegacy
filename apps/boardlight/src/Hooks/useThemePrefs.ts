import { useSelector } from "react-redux";
import { RootState } from "../State";
import { themeState } from "../State/themeReducer";

export default function useThemePrefs(): themeState {
    return useSelector<RootState>((state: RootState) => state.theme) as themeState;
}
