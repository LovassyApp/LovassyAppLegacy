import "dayjs/locale/hu";

import { Box, Center, Select, SimpleGrid, createStyles, useMantineTheme } from "@mantine/core";
import { Calendar, Eye } from "tabler-icons-react";
import { HomeTimeline, ViewMode } from "../../components/content/homeTimeline";
import { useInputState, useViewportSize } from "@mantine/hooks";

import { DateRangePicker } from "@mantine/dates";
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
    },
    timelinePickerContainer: {
        flex: "0 1 auto",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
    },
    rangePickerDays: {
        textTransform: "lowercase",
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
                            sx={{ flexGrow: 1 }}
                            p={10}
                        />
                    </Box>
                    <Center className={classes.timelineCenter}>
                        <HomeTimeline data={null} viewMode={viewMode} range={range} />
                    </Center>
                </Box>
                <Box />
            </SimpleGrid>
        </Box>
    );
};
