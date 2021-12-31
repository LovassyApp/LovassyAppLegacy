/*
    React portáloknak köszönhetően:
        Modal state updatek eventekkel
        Ezért még egyszer pokolra jutok
            - minigyima, 2021
*/
import { useEffect, useRef, useState } from 'react';

const useStatefulEvent = (initialValue, eventName) => {
	const ref = useRef(initialValue);
	const [state, setState] = useState(initialValue);
	const update = (value) => {
		ref.current = value;
		const event = new CustomEvent(eventName, { detail: value });
		document.dispatchEvent(event);
		setState(value);
	};

	return [ref, state, update, { eventName: eventName, currentValue: ref.current }];
};

const useStatefulListener = (eventDeclaration) => {
	const [state, setState] = useState(eventDeclaration.currentValue);
	const callback = (event) => {
		setState(event.detail);
	};
	useEffect(() => {
		document.addEventListener(eventDeclaration.eventName, callback);

		return () => {
			document.removeEventListener(eventDeclaration.eventName, callback);
		};
	});

	return state;
};

export { useStatefulEvent, useStatefulListener };
