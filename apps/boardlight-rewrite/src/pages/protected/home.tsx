import "dayjs/locale/hu";

import { Box, SimpleGrid, Stack, createStyles, useMantineTheme } from "@mantine/core";

import { HomeStatsWrapper } from "../../components/content/wrapper/homeStatsWrapper";
import { HomeTimelineWrapper } from "../../components/content/wrapper/homeTimelineWrapper";
import React from "react";
import { useViewportSize } from "@mantine/hooks";

const useStyles = createStyles((theme, height: number) => ({
    timelineContainer: {
        height: height - 92,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        borderRadius: theme.radius.md,
        display: "flex",
        flexDirection: "column",
    },
    statsContainer: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        borderRadius: theme.radius.md,
        padding: theme.spacing.xs,
    },
}));

export const Home = (): JSX.Element => {
    const theme = useMantineTheme();
    const { height } = useViewportSize();
    const { classes } = useStyles(height);

    return (
        <Box>
            <SimpleGrid
                cols={2}
                spacing="md"
                breakpoints={[{ maxWidth: theme.breakpoints.md, cols: 1 }]}>
                <Box className={classes.timelineContainer}>
                    <HomeTimelineWrapper />
                </Box>
                <Stack>
                    <Box className={classes.statsContainer}>
                        <HomeStatsWrapper />
                    </Box>
                    <Box />
                </Stack>
            </SimpleGrid>
        </Box>
    );
};
