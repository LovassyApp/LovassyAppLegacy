import { Box, Button, Center, Text, createStyles } from "@mantine/core";

import { useNavigate } from "react-router-dom";

const useStyles = createStyles((theme) => ({
    container: {
        height: "100vh",
        flexDirection: "column",
    },
    errorText: {
        fontSize: "250px",

        [`@media (max-width: ${theme.breakpoints.lg}px)`]: {
            fontSize: "220px",
        },

        [`@media (max-width: ${theme.breakpoints.md}px)`]: {
            fontSize: "200px",
        },

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            fontSize: "180px",
        },

        [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
            fontSize: "150px",
        },
    },
    errorDescription: {
        marginBottom: theme.spacing.lg,
    },
}));

export const Four0Four = (): JSX.Element => {
    const { classes } = useStyles();
    const navigate = useNavigate();

    return (
        <Center className={classes.container}>
            <Text
                className={classes.errorText}
                variant="gradient"
                gradient={{ from: "indigo", to: "cyan", deg: 45 }}>
                404
            </Text>
            <Text size="xl" className={classes.errorDescription}>
                Hoppá! Úgy néz ki ez az oldal nem létezik.
            </Text>
            <Button
                onClick={() => navigate("/home")}
                variant="gradient"
                gradient={{ from: "indigo", to: "cyan", deg: 45 }}>
                Vissza a kezdőlapra
            </Button>
        </Center>
    );
};
