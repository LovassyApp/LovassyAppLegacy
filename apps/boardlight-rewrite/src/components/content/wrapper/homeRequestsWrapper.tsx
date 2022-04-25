import { Box, Loader, createStyles } from "@mantine/core";
import React, { Suspense } from "react";

const useStyles = createStyles((theme) => ({
    requestsContainer: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        borderRadius: theme.radius.md,
        padding: theme.spacing.xs,
        flex: 1,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        overflow: "hidden",
    },
    requestsFallbackContainer: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        borderRadius: theme.radius.md,
    },
}));

export const HomeRequestsWrapper = (): JSX.Element => {
    const { classes } = useStyles();

    const HomeRequests = React.lazy(() => import("../homeRequests"));

    return (
        <>
            <Suspense
                fallback={
                    <Box className={classes.requestsFallbackContainer}>
                        <Loader />
                    </Box>
                }>
                <Box className={classes.requestsContainer}>
                    <HomeRequests />
                </Box>
            </Suspense>
        </>
    );
};
