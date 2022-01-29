import { RootState } from '.';

export const loadState = (): any => {
    try {
        const serializedState = localStorage.getItem('boardlight.persist');

        if (serializedState === null) {
            return undefined;
        }

        return JSON.parse(serializedState);
    } catch (error) {}
    return undefined;
};

const __savedStateFactory__ = (state: RootState) => {
    return {
        theme: state.theme,
    };
};

export const saveState = (state: RootState): void => {
    try {
        const saveState = __savedStateFactory__(state);
        const serializedData = JSON.stringify(saveState);
        console.log(saveState);
        localStorage.setItem('boardlight.persist', serializedData);
    } catch (err) {}
};
