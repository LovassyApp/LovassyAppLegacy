const objectWithoutKey = (object, key) => {
	const { [key]: deletedKey, ...otherKeys } = object;
	return otherKeys;
};

export const loadState = () => {
	try {
		const serializedState = sessionStorage.getItem('state');

		if (serializedState === null) {
			return undefined;
		}

		return JSON.parse(serializedState);
	} catch (error) {
		return undefined;
	}
};

export const saveState = (state) => {
	try {
		const serializedState = JSON.stringify(objectWithoutKey(state, 'router'));
		sessionStorage.setItem('state', serializedState);
	} catch (error) {
		// Ignore write errors.
	}
};
