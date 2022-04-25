import {
    ActionIcon,
    Anchor,
    Button,
    Group,
    ScrollArea,
    Space,
    Text,
    TextInput,
    Textarea,
    Title,
} from "@mantine/core";

import { BlueboardClient } from "blueboard-client";
import { NotificationsContextProps } from "@mantine/notifications/lib/types";
import { Plus } from "tabler-icons-react";
import { RequestCard } from "./requestCard";
import { RootState } from "../../store/store";
import { useBlueboardClient } from "blueboard-client-react";
import { useInputState } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import { useNotifications } from "@mantine/notifications";
import { useSelector } from "react-redux";

const NewModalContent = ({
    notifications,
    client,
}: {
    notifications: NotificationsContextProps;
    client: BlueboardClient;
}): JSX.Element => {
    const modals = useModals();

    const [title, setTitle] = useInputState("");
    const [body, setBody] = useInputState("");

    const submitCallback = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        modals.closeAll();

        try {
            await client.lolo_request.make(title, body);
            notifications.showNotification({
                title: "Új kérvény",
                message: "Kérvény küldése sikeres",
                color: "green",
                autoClose: 5000,
            });
        } catch (err) {
            notifications.showNotification({
                title: "Új kérvény",
                message: "Kérvény küldése sikertelen",
                color: "red",
                autoClose: 5000,
            });
        }
    };

    return (
        <form onSubmit={submitCallback}>
            <TextInput
                label="Cím"
                variant="filled"
                required={true}
                value={title}
                onChange={setTitle}
            />
            <Textarea
                label="Törzsszöveg"
                variant="filled"
                required={true}
                value={body}
                onChange={setBody}
            />
            <Space h="sm" />
            <Button fullWidth={true} type="submit">
                Beküldés
            </Button>
        </form>
    );
};

const HomeRequests = (): JSX.Element => {
    const requests = useSelector((state: RootState) => state.requests.value);

    const modals = useModals();
    const notifications = useNotifications();

    const client = useBlueboardClient();

    const getRequestCards = (): JSX.Element[] => {
        return requests.map((request) => <RequestCard key={request.id} request={request} />);
    };

    const openNewModal = (): void => {
        const id = modals.openModal({
            title: "Új kérvény létrehozása",
            children: <NewModalContent notifications={notifications} client={client} />,
        });
    };

    return (
        <>
            <Group position="apart" align="center">
                <Title order={3}>Kérvények</Title>
                <ActionIcon>
                    <Plus onClick={() => openNewModal()} />
                </ActionIcon>
            </Group>
            <ScrollArea scrollbarSize={6} type="hover">
                {getRequestCards()}
            </ScrollArea>
        </>
    );
};

export default HomeRequests;
