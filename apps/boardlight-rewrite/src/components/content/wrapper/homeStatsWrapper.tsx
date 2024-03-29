import { Box, Loader, createStyles } from "@mantine/core";
import React, { Suspense } from "react";

const useStyles = createStyles((theme) => ({
    statsContainer: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        borderRadius: theme.radius.md,
        padding: theme.spacing.xs,
        flex: 1,
    },
    statsFallbackContainer: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        borderRadius: theme.radius.md,
    },
}));

export const HomeStatsWrapper = (): JSX.Element => {
    const { classes } = useStyles();

    const HomeStats = React.lazy(() => import("../homeStats"));

    return (
        <Suspense
            fallback={
                <Box className={classes.statsFallbackContainer}>
                    <Loader />
                </Box>
            }>
            <Box className={classes.statsContainer}>
                <HomeStats />
            </Box>
        </Suspense>
    );
};
