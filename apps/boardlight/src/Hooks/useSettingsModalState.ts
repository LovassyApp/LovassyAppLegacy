import {useSelector} from "react-redux";
import {RootState} from "../State";

export default function useSettingsModalState(): boolean {
    return useSelector<RootState>((state) => state.settingsModal.isOpen) as boolean;
}
