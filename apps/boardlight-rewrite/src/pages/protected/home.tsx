import "dayjs/locale/hu";

import {
    Box,
    Center,
    Loader,
    ScrollArea,
    Select,
    SimpleGrid,
    Stack,
    createStyles,
    useMantineTheme,
} from "@mantine/core";
import { Calendar, Eye } from "tabler-icons-react";
import React, { Suspense } from "react";
import { useInputState, useViewportSize } from "@mantine/hooks";

import { DateRangePicker } from "@mantine/dates";
import { HomeStats } from "../../components/content/homeStats";
import { ViewMode } from "../../components/content/homeTimeline";
import dayjs from "dayjs";

const viewModeData = [
    {
        value: ViewMode.Summary,
        label: "Összesítés",
    },
    {
        value: ViewMode.Details,
        label: "Részletek",
    },
];

const useStyles = createStyles((theme, height: number) => ({
    timelineContainer: {
        height: height - 92,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        borderRadius: theme.radius.md,
        display: "flex",
        flexDirection: "column",
    },
    timelineCenter: {
        flex: "1 1 auto",
        paddingTop: 20,
        paddingBottom: 20,
    },
    timelinePickerContainer: {
        flex: "0 1 auto",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
    },
    timelineScrollview: {
        flex: "1 1 auto",
        margin: 10,
    },
    rangePickerDays: {
        textTransform: "lowercase",
    },
    timelineFallbackContainer: {
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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

    const [range, setRange] = useInputState<[Date, Date]>([
        dayjs(new Date()).startOf("month").toDate(),
        dayjs(new Date()).endOf("month").toDate(),
    ]);
    const [viewMode, setViewMode] = useInputState<ViewMode>(ViewMode.Summary);

    const HomeTimeline = React.lazy(() => import("../../components/content/homeTimeline"));

    return (
        <Box>
            <SimpleGrid
                cols={2}
                spacing="md"
                breakpoints={[{ maxWidth: theme.breakpoints.md, cols: 1 }]}>
                <Box className={classes.timelineContainer}>
                    <Box className={classes.timelinePickerContainer}>
                        <DateRangePicker
                            label="Időszak"
                            value={range}
                            onChange={setRange}
                            locale="hu"
                            clearable={false}
                            icon={<Calendar size={18} />}
                            variant="filled"
                            p={10}
                            sx={{ flexGrow: 3 }}
                            classNames={{ weekday: classes.rangePickerDays }}
                        />
                        <Select
                            label="Nézet"
                            value={viewMode}
                            onChange={(value) => setViewMode(value as ViewMode)}
                            data={viewModeData}
                            icon={<Eye size={18} />}
                            variant="filled"
                            sx={{ flexGrow: 1 }}
                            p={10}
                        />
                    </Box>
                    {viewMode === ViewMode.Details ? (
                        <Suspense
                            fallback={
                                <Box className={classes.timelineFallbackContainer}>
                                    <Loader />
                                </Box>
                            }>
                            <ScrollArea
                                type="hover"
                                scrollbarSize={6}
                                className={classes.timelineScrollview}>
                                <Center className={classes.timelineCenter}>
                                    <HomeTimeline viewMode={viewMode} range={range} />
                                </Center>
                            </ScrollArea>
                        </Suspense>
                    ) : (
                        <Suspense
                            fallback={
                                <Box className={classes.timelineFallbackContainer}>
                                    <Loader />
                                </Box>
                            }>
                            <Center className={classes.timelineCenter}>
                                <HomeTimeline viewMode={viewMode} range={range} />
                            </Center>
                        </Suspense>
                    )}
                </Box>
                <Stack>
                    <Box className={classes.statsContainer}>
                        <HomeStats />
                    </Box>
                    <Box />
                </Stack>
            </SimpleGrid>
        </Box>
    );
};
