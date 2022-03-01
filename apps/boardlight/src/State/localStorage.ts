import { RootState } from '.';

export const loadState = (): any => {
    try {
        const serializedState = localStorage.getItem('boardlight.persist');

        if (serializedState === null) {
            return undefined;
        }

        return JSON.parse(serializedState);
    } catch (error) {
        // nothing
    }
    return undefined;
};

const savedStateFactory = (state: RootState): any => {
    return {
        theme: state.theme,
    };
};

export const saveState = (state: RootState): void => {
    try {
        const saveState = savedStateFactory(state);
        const serializedData = JSON.stringify(saveState);
        localStorage.setItem('boardlight.persist', serializedData);
    } catch (err) {
        // nothing
    }
};
