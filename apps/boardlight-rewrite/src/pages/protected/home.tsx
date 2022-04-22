import {
    Box,
    Center,
    Select,
    SimpleGrid,
    Text,
    Timeline,
    createStyles,
    useMantineTheme,
} from "@mantine/core";
import { BoxModel2, Businessplan, CircleCheck, Microscope } from "tabler-icons-react";

import { DateRangePicker } from "@mantine/dates";
import { useViewportSize } from "@mantine/hooks";

enum ViewMode {
    Summary = "summary",
    Details = "details",
}

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
                    <Box className={classes.timelinePickerContainer}>
                        <DateRangePicker sx={{ flexGrow: 3 }} label="Időszak" p={10} />
                        <Select sx={{ flexGrow: 1 }} label="Nézet" data={viewModeData} p={10} />
                    </Box>

                    <Center className={classes.timelineCenter}>
                        <Timeline active={1} bulletSize={32} lineWidth={2}>
                            <Timeline.Item bullet={<Microscope size={18} />} title="Jegyek">
                                <Text color="dimmed" size="sm">
                                    A kijelölt időszakban{" "}
                                    <Text
                                        color={theme.primaryColor}
                                        inherit={true}
                                        component="span">
                                        6
                                    </Text>{" "}
                                    új jegyet kaptál
                                </Text>
                            </Timeline.Item>

                            <Timeline.Item bullet={<Businessplan size={18} />} title="Loló">
                                <Text color="dimmed" size="sm">
                                    A kijelölt időszakban{" "}
                                    <Text
                                        color={theme.primaryColor}
                                        inherit={true}
                                        component="span">
                                        2
                                    </Text>{" "}
                                    új loló érmét kaptál
                                </Text>
                            </Timeline.Item>

                            <Timeline.Item
                                title="Tárgyak"
                                bullet={<BoxModel2 size={18} />}
                                lineVariant="dashed">
                                <Text color="dimmed" size="sm">
                                    A kijelölt időszakban{" "}
                                    <Text
                                        color={theme.primaryColor}
                                        inherit={true}
                                        component="span">
                                        3
                                    </Text>{" "}
                                    tárgyat vásároltál
                                </Text>
                            </Timeline.Item>

                            <Timeline.Item title="Aktiválások" bullet={<CircleCheck size={18} />}>
                                <Text color="dimmed" size="sm">
                                    A kijelölt időszakban{" "}
                                    <Text
                                        color={theme.primaryColor}
                                        inherit={true}
                                        component="span">
                                        3
                                    </Text>{" "}
                                    tárgyat aktiváltál
                                </Text>
                            </Timeline.Item>
                        </Timeline>
                    </Center>
                </Box>
                <Box />
            </SimpleGrid>
        </Box>
    );
};
