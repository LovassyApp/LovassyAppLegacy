import { BlueboardClient } from 'blueboard-client';
import { useContext } from 'react';
import { globalState } from '../BlueboardClientInit';

const useBlueboardClient = (): BlueboardClient => {
    return useContext(globalState.BlueboardClientContext);
};

export default useBlueboardClient;
