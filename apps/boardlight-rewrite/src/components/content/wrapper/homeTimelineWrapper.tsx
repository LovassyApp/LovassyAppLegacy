import { Box, Center, Loader, ScrollArea, Select, createStyles } from "@mantine/core";
import { Calendar, Eye } from "tabler-icons-react";
import React, { Suspense } from "react";

import { DateRangePicker } from "@mantine/dates";
import { ViewMode } from "../homeTimeline";
import dayjs from "dayjs";
import { useInputState } from "@mantine/hooks";

const useStyles = createStyles((theme) => ({
    timelineCenter: {
        flex: "1 1 auto",
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.md,
    },
    timelinePickerContainer: {
        flex: "0 1 auto",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
    },
    timelineScrollview: {
        flex: "1 1 auto",
        margin: theme.spacing.sm,
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
}));

const viewModeData = [
    {
        value: ViewMode.Summary,
        label: "Összesítés",
    },
    {
        value: ViewMode.Details,
        label: "Részletes",
    },
];

export const HomeTimelineWrapper = (): JSX.Element => {
    const [range, setRange] = useInputState<[Date, Date]>([
        dayjs(new Date()).startOf("month").toDate(),
        dayjs(new Date()).endOf("month").toDate(),
    ]);

    const [viewMode, setViewMode] = useInputState<ViewMode>(ViewMode.Summary);

    const HomeTimeline = React.lazy(() => import("../homeTimeline"));

    const { classes } = useStyles();

    return (
        <>
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
        </>
    );
};
