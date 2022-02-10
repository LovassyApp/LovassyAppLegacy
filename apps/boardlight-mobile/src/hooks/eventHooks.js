/*
    React portáloknak köszönhetően:
        Modal state updatek eventekkel
        Ezért még egyszer pokolra jutok
            - minigyima, 2021
        Én meg átírtam js-be, hogy aztán egyszer majd újra ts lehessen, jee
            - xeretis 2022
*/
import { useEffect, useRef, useState } from "react";

import { EventRegister } from "react-native-event-listeners";

const useStatefulEvent = (initialValue, eventName) => {
  const ref = useRef(initialValue);

  const update = (value) => {
    ref.current = value;
    EventRegister.emit(eventName, { detail: value });
  };

  const decl = { eventName: eventName, currentValue: ref.current };

  return [ref, update, decl];
};

const useStatefulListener = (eventDeclaration) => {
  const [state, setState] = useState(eventDeclaration.currentValue);
  const listener = useRef(null);

  const callback = (event) => {
    setState(event.detail);
  };

  useEffect(() => {
    listener.current = EventRegister.on(eventDeclaration.eventName, callback);

    return () => {
      EventRegister.rm(listener.current);
    };
  });

  return state;
};

export { useStatefulEvent, useStatefulListener };
