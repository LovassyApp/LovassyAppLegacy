/*
    React portáloknak köszönhetően:
        Modal state updatek eventekkel
        Ezért még egyszer pokolra jutok
            - minigyima, 2021
*/
import { MutableRefObject, useEffect, useRef, useState } from 'react';

export interface eventDeclaration<ValueType> {
    eventName: string;
    currentValue: ValueType;
}

const useStatefulEvent = <Type>(
    initialValue: Type,
    eventName: string,
): [MutableRefObject<Type>, (value: Type) => void, eventDeclaration<Type>] => {
    const ref = useRef<Type>(initialValue);
    const update = (value: any): void => {
        ref.current = value;
        const event = new CustomEvent(eventName, { detail: value });
        document.dispatchEvent(event);
    };

    const decl: eventDeclaration<typeof initialValue> = {
        eventName: eventName,
        currentValue: ref.current,
    };

    return [ref, update, decl];
};

const useStatefulListener = <Type>(decl: eventDeclaration<Type>): Type => {
    const [state, setState] = useState<Type>(decl.currentValue);
    const callback = (event: any): void => {
        setState(event.detail);
    };
    useEffect(() => {
        document.addEventListener(decl.eventName, callback);

        return () => {
            document.removeEventListener(decl.eventName, callback);
        };
    });

    return state;
};

export { useStatefulEvent, useStatefulListener };
