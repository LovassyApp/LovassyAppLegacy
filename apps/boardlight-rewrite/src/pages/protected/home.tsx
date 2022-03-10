import { Box, Center, SimpleGrid, Text, Timeline, useMantineTheme } from "@mantine/core";
import {
    BoxModel2,
    Businessplan,
    CircleCheck,
    GitCommit,
    GitPullRequest,
    MessageDots,
    Microscope,
} from "tabler-icons-react";

import { useViewportSize } from "@mantine/hooks";

export const Home = (): JSX.Element => {
    const theme = useMantineTheme();
    const { height } = useViewportSize();

    return (
        <Box>
            <SimpleGrid
                cols={2}
                spacing="md"
                breakpoints={[{ maxWidth: theme.breakpoints.md, cols: 1 }]}>
                <Center
                    sx={{
                        height: height - 92,
                        backgroundColor: theme.colors.dark[7],
                        borderRadius: theme.radius.md,
                    }}>
                    <Timeline active={1} bulletSize={32} lineWidth={2}>
                        <Timeline.Item bullet={<Microscope size={18} />} title="Jegyek">
                            <Text color="dimmed" size="sm">
                                A kijelölt időszakban{" "}
                                <Text color={theme.primaryColor} inherit={true} component="span">
                                    6
                                </Text>{" "}
                                új jegyet kaptál
                            </Text>
                        </Timeline.Item>

                        <Timeline.Item bullet={<Businessplan size={18} />} title="Loló">
                            <Text color="dimmed" size="sm">
                                A kijelölt időszakban{" "}
                                <Text color={theme.primaryColor} inherit={true} component="span">
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
                                <Text color={theme.primaryColor} inherit={true} component="span">
                                    3
                                </Text>{" "}
                                tárgyat vásároltál
                            </Text>
                        </Timeline.Item>

                        <Timeline.Item title="Aktiválások" bullet={<CircleCheck size={18} />}>
                            <Text color="dimmed" size="sm">
                                A kijelölt időszakban{" "}
                                <Text color={theme.primaryColor} inherit={true} component="span">
                                    3
                                </Text>{" "}
                                tárgyat aktiváltál
                            </Text>
                        </Timeline.Item>
                    </Timeline>
                </Center>
                <Box />
            </SimpleGrid>
        </Box>
    );
};
