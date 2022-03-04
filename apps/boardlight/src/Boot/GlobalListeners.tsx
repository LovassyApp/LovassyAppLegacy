import toast from 'react-hot-toast';
import { useGroups, useUser } from '../Hooks/ControlHooks';
import {
    useBlueboardChannel /* useBlueboardPrivateChannel */,
    useBlueboardPrivateChannel,
} from 'blueboard-client-react';
import useToken from '../Hooks/useToken';
import { useDispatch } from 'react-redux';
import { BlueboardUser, BlueboardUserGroup } from 'blueboard-client';
import { AppDispatch } from '../State';
import { setGroups, setUser } from '../State/controlReducer';

const GroupListener = ({
    groupID,
    groups,
    dispatch,
}: {
    groupID: number;
    groups: BlueboardUserGroup[];
    dispatch: AppDispatch;
}): JSX.Element => {
    useBlueboardPrivateChannel(`Groups.${groupID}`, 'UserGroupUpdated', (data: any) => {
        const groupsClone = [...groups];
        const index = groupsClone.findIndex((x) => x.id === groupID);

        if (index === -1) {
            groupsClone.push(data.group);
        } else {
            groupsClone[index] = data.group;
        }

        dispatch(setGroups(groupsClone));
        toast.success('Felhasználói jogosultságok frissítve!');
    });
    return <></>;
};

const AuthedListeners = ({
    dispatch,
    user,
}: {
    dispatch: AppDispatch;
    user: BlueboardUser;
}): JSX.Element => {
    useBlueboardPrivateChannel(`Users.${user.id}`, 'LoloAmountUpdated', (res: any) => {
        console.log(res);
        const newUser = { ...user, balance: res.balance } as BlueboardUser;
        dispatch(setUser(newUser));
    });
    useBlueboardPrivateChannel(`Users.${user.id}`, 'UserGroupsChanged', (res: any) => {
        dispatch(setGroups(res.groups));
    });

    return <></>;
};

const GlobalListeners = (): JSX.Element => {
    const groups = useGroups() ?? [];
    const token = useToken();
    const dispatch = useDispatch();
    const user = useUser();

    const isUser = token !== null;

    useBlueboardChannel('global', 'GlobalEvent', (data: any) => {
        toast(data.message);
    });

    return (
        <>
            {isUser ? (
                <>
                    <AuthedListeners user={user} dispatch={dispatch} />
                    {groups.map((el, key) => (
                        <GroupListener
                            dispatch={dispatch}
                            groups={groups}
                            // eslint-disable-next-line react/no-array-index-key
                            key={key}
                            groupID={el.id as number}
                        />
                    ))}
                </>
            ) : (
                <></>
            )}
        </>
    );
};

export default GlobalListeners;
