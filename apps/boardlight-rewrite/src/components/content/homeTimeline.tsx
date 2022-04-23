import { BlueboardInventoryItem, BlueboardKretaGrade, BlueboardLoloCoin } from "blueboard-client";
import { BoxModel2, Businessplan, CircleCheck, Microscope } from "tabler-icons-react";
import { Text, Timeline, useMantineTheme } from "@mantine/core";

export interface HomeTimelineData {
    grades: BlueboardKretaGrade[];
    coins: BlueboardLoloCoin[];
    items: BlueboardInventoryItem[];
}

export enum ViewMode {
    Summary = "summary",
    Details = "details",
}

export const HomeTimeline = ({
    data,
    viewMode,
    range,
}: {
    data: HomeTimelineData;
    viewMode: "summary" | "details";
    range: [Date, Date];
}): JSX.Element => {
    const theme = useMantineTheme();

    if (!range[0] || !range[1]) {
        return <Text>Kérlek válassz ki egy időszakot!</Text>;
    }

    return (
        <Timeline active={1} bulletSize={32} lineWidth={2} m={10}>
            <Timeline.Item bullet={<Microscope size={18} />} title="Jegyek">
                <Text color="dimmed" size="sm">
                    A kijelölt időszakban{" "}
                    <Text color={theme.primaryColor} inherit={true} component="span">
                        6
                    </Text>{" "}
                    új jegyet kaptál
                </Text>
            </Timeline.Item>

            <Timeline.Item bullet={<Businessplan size={18} />} lineVariant="dashed" title="Loló">
                <Text color="dimmed" size="sm">
                    A kijelölt időszakban{" "}
                    <Text color={theme.primaryColor} inherit={true} component="span">
                        2
                    </Text>{" "}
                    új loló érmét kaptál
                </Text>
            </Timeline.Item>

            <Timeline.Item title="Tárgyak" bullet={<BoxModel2 size={18} />}>
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
    );
};
