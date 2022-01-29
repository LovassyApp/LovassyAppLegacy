/*
    React portáloknak köszönhetően:
        Modal state updatek eventekkel
        Ezért még egyszer pokolra jutok
            - minigyima, 2021
*/
import { MutableRefObject, useEffect, useRef, useState } from 'react';

export type eventDeclaration = {
    eventName: string;
    currentValue: any;
};

const useStatefulEvent = (
    initialValue: any,
    eventName: any
): [MutableRefObject<any>, (value: any) => void, eventDeclaration] => {
    const ref = useRef(initialValue);
    const update = (value: any) => {
        ref.current = value;
        const event = new CustomEvent(eventName, { detail: value });
        document.dispatchEvent(event);
    };

    const decl: eventDeclaration = { eventName: eventName, currentValue: ref.current };

    return [ref, update, decl];
};

const useStatefulListener = (eventDeclaration: eventDeclaration): any => {
    const [state, setState] = useState(eventDeclaration.currentValue);
    const callback = (event: any) => {
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
