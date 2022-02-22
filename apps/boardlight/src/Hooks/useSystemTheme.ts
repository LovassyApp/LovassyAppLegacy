import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { RootState } from "../State";
import { setDark, setSystemMode } from "../State/themeReducer";

const useSystemTheme = (): void => {
    const canSetTheme: boolean = useSelector<RootState>(
        (state: RootState) => state.theme.isSynced,
    ) as boolean;
    const systemTheme: string = useSelector<RootState>(
        (state: RootState) => state.theme.systemMode,
    ) as string;

    const dispatch = useDispatch();

    const callback = (event: MediaQueryListEvent | MediaQueryList): void => {
        dispatch(setSystemMode(event.matches ? "dark" : "light"));
    };

    React.useEffect(() => {
        const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");

        if (darkThemeMq.matches) {
            callback(darkThemeMq);
        }

        darkThemeMq.addListener(callback);

        return () => {
            darkThemeMq.removeListener(callback);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (canSetTheme) {
            dispatch(setDark(systemTheme === "dark"));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canSetTheme, systemTheme]);
};

export default useSystemTheme;
