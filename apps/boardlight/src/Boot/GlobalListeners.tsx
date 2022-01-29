import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useUser } from '../Hooks/ControlHooks';
import { useBlueboardChannel /* useBlueboardPrivateChannel */ } from 'blueboard-client-react';

const GlobalListeners = () => {
    const user = useUser();
    useEffect(() => {
        if (user !== undefined && Object.keys(user).length !== 0) {
            //console.log(user);
        }
    }, [user]);

    useBlueboardChannel('global', 'GlobalEvent', (data: any) => {
        toast(data.message);
    });

    return <></>;
};

export default GlobalListeners;
