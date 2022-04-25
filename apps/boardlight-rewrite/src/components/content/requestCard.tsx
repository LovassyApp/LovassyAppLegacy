import { Anchor, Badge, Box, Group, Text, Title, createStyles } from "@mantine/core";

import { BlueboardLoloRequest } from "blueboard-client";
import { useModals } from "@mantine/modals";

const useStyles = createStyles((theme) => ({
    container: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
        marginTop: theme.spacing.sm,
        marginBottom: theme.spacing.sm,
        borderRadius: theme.radius.md,
        padding: theme.spacing.xs,
        overflowX: "hidden",
    },
    bodyText: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        width: "20ch",
        maxWidth: "70%",
    },
}));

export const RequestCard = ({ request }: { request: BlueboardLoloRequest }): JSX.Element => {
    const { classes } = useStyles();

    const modals = useModals();

    const openDetails = (): void => {
        const id = modals.openModal({
            title: "Részletek",
            children: (
                <>
                    <Text>Cím: {request.title}</Text>
                    <Text>Törzsszöveg: {request.body}</Text>
                    <Text>
                        Állapot: {request.acceptedAt && "Elfogadva"}
                        {request.deniedAt && "Elutasítva"}
                        {!request.acceptedAt && !request.deniedAt && "Függőben"}
                    </Text>
                </>
            ),
        });
    };

    return (
        <Box className={classes.container}>
            <Group position="apart">
                <Box>
                    <Title order={5}>{request.title}</Title>
                    <Anchor onClick={() => openDetails()}>Részletek</Anchor>
                </Box>
                <Badge
                    variant="filled"
                    color={request.acceptedAt ? "green" : request.deniedAt ? "red" : "yellow"}>
                    {request.acceptedAt && "Elfogadva"}
                    {request.deniedAt && "Elutasítva"}
                    {!request.acceptedAt && !request.deniedAt && "Függőben"}
                </Badge>
            </Group>
        </Box>
    );
};
