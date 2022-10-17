// @ts-nocheck
import {
    BoxModel2,
    Businessplan,
    CalendarEvent,
    CircleCheck,
    Microscope,
} from "tabler-icons-react";
import { Text, Timeline, useMantineTheme } from "@mantine/core";

import { RootState } from "../../store/store";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

export enum ViewMode {
    Summary = "summary",
    Details = "details",
}

interface DatedEvent {
    date: Date;
    event: string;
    id: any;
}

class GradeReceive implements DatedEvent {
    public readonly event = "gradeReceive";

    public constructor(
        public readonly date: Date,
        public readonly subject: string,
        public readonly grade: number,
        public readonly teacher: string,
        public readonly weight: number,
        public readonly id: number
    ) {}
}

class LoloReceive implements DatedEvent {
    public readonly event = "loloReceive";

    public constructor(
        public readonly date: Date,
        public readonly reasonText: string,
        public readonly reasonBody: string,
        public readonly id: number
    ) {}
}

class ItemBuy implements DatedEvent {
    public readonly event = "itemBuy";

    public constructor(
        public readonly date: Date,
        public readonly name: string,
        public readonly id: number
    ) {}
}

class ItemUse implements DatedEvent {
    public readonly event = "itemUse";

    public constructor(
        public readonly date: Date,
        public readonly name: string,
        public readonly id: number
    ) {}
}

const HomeTimeline = ({
    viewMode,
    range,
}: {
    viewMode: ViewMode;
    range: [Date, Date];
}): JSX.Element => {
    const theme = useMantineTheme();

    const gradeData = useSelector((state: RootState) => state.kreta.gradeData);
    const coins = useSelector((state: RootState) => state.coins.value);
    const items = useSelector((state: RootState) => state.inventory.items);

    if (!range[0] || !range[1]) {
        return <Text>Kérlek válassz ki egy időszakot!</Text>;
    }

    if (viewMode === ViewMode.Summary) {
        const filteredGrades = [];

        for (const data of gradeData) {
            for (const grade of data.grades) {
                const date = dayjs(grade.date, "YYYY-MM-DD HH:mm:ss").toDate();
                if (date >= range[0] && date <= range[1]) {
                    filteredGrades.push(grade);
                }
            }
        }

        const filteredCoins = coins.filter((coin) => {
            const date = new Date(coin.timestamps.createdAt);
            return date >= range[0] && date <= range[1];
        });

        const filteredItemsBought = [];
        const filteredItemsUsed = [];

        for (const item of items) {
            const buyDate = new Date(item.timestamps.createdAt);
            if (buyDate >= range[0] && buyDate <= range[1]) {
                filteredItemsBought.push(item);
            }

            if (item.usedAt) {
                const useDate = new Date(item.usedAt);
                if (useDate >= range[0] && useDate <= range[1]) {
                    filteredItemsUsed.push(item);
                }
            }
        }

        return (
            <Timeline active={1} bulletSize={32} lineWidth={2} m={10}>
                <Timeline.Item bullet={<Microscope size={18} />} title="Jegyek">
                    <Text color="dimmed" size="sm">
                        A kijelölt időszakban{" "}
                        <Text
                            color={theme.primaryColor}
                            inherit={true}
                            component="span"
                        >
                            {filteredGrades.length}
                        </Text>{" "}
                        új jegyet kaptál
                    </Text>
                </Timeline.Item>

                <Timeline.Item
                    bullet={<Businessplan size={18} />}
                    lineVariant="dashed"
                    title="Loló"
                >
                    <Text color="dimmed" size="sm">
                        A kijelölt időszakban{" "}
                        <Text
                            color={theme.primaryColor}
                            inherit={true}
                            component="span"
                        >
                            {filteredCoins.length}
                        </Text>{" "}
                        új loló érmét kaptál
                    </Text>
                </Timeline.Item>

                <Timeline.Item title="Tárgyak" bullet={<BoxModel2 size={18} />}>
                    <Text color="dimmed" size="sm">
                        A kijelölt időszakban{" "}
                        <Text
                            color={theme.primaryColor}
                            inherit={true}
                            component="span"
                        >
                            {filteredItemsBought.length}
                        </Text>{" "}
                        tárgyat vásároltál
                    </Text>
                </Timeline.Item>

                <Timeline.Item
                    title="Aktiválások"
                    bullet={<CircleCheck size={18} />}
                >
                    <Text color="dimmed" size="sm">
                        A kijelölt időszakban{" "}
                        <Text
                            color={theme.primaryColor}
                            inherit={true}
                            component="span"
                        >
                            {filteredItemsUsed.length}
                        </Text>{" "}
                        tárgyat aktiváltál
                    </Text>
                </Timeline.Item>
            </Timeline>
        );
    }

    const data = [];

    for (const gData of gradeData) {
        for (const grade of gData.grades) {
            const date = dayjs(grade.date, "YYYY-MM-DD HH:mm:ss").toDate();
            if (date >= range[0] && date <= range[1]) {
                data.push(
                    // @ts-ignore
                    new GradeReceive(
                        date,
                        grade.subject,
                        grade.grade,
                        grade.teacher,
                        grade.weight,
                        grade.id
                    )
                );
            }
        }
    }

    for (const coin of coins) {
        const date = new Date(coin.timestamps.createdAt);
        if (date >= range[0] && date <= range[1]) {
            data.push(
                new LoloReceive(date, coin.reasonText, coin.reasonBody, coin.id)
            );
        }
    }

    for (const item of items) {
        const buyDate = new Date(item.timestamps.createdAt);
        if (buyDate >= range[0] && buyDate <= range[1]) {
            data.push(new ItemBuy(buyDate, item.product.name, item.id));
        }

        if (item.usedAt) {
            const useDate = new Date(item.usedAt);
            if (useDate >= range[0] && useDate <= range[1]) {
                data.push(new ItemUse(useDate, item.product.name, item.id));
            }
        }
    }

    const groupedData = {};

    for (const e of data) {
        const curDay = dayjs(e.date).format("YYYY.MM.DD.");

        if (!groupedData[curDay]) {
            groupedData[curDay] = [e];
        } else {
            groupedData[curDay].push(e);
        }
    }

    const formattedGroupedData = Object.keys(groupedData).map((date) => {
        return {
            date,
            events: groupedData[date],
        };
    });

    dayjs.extend(customParseFormat);

    formattedGroupedData.sort((e1, e2) => {
        if (
            dayjs(e1.date, "YYYY.MM.DD.").isBefore(
                dayjs(e2.date, "YYYY.MM.DD.")
            )
        ) {
            return 1;
        }
        return -1;
    });

    const getTimelineItems = (): JSX.Element[] => {
        const getRenderedEvents = (events: any[]): JSX.Element[] => {
            return events.map((e) => {
                switch (e.event) {
                    case "gradeReceive":
                        return (
                            <Text color="dimmed" size="sm" key={e.id}>
                                Kaptál egy új{` ${e.subject.toLowerCase()} `}
                                <Text
                                    color={theme.primaryColor}
                                    inherit={true}
                                    component="span"
                                >
                                    {e.grade}
                                </Text>
                                -
                                {e.grade === 5
                                    ? "öst "
                                    : e.grade === 3
                                    ? "ast "
                                    : "est "}
                                <Text
                                    color={theme.primaryColor}
                                    inherit={true}
                                    component="span"
                                >
                                    {e.teacher}
                                </Text>
                                -tól/től ami{" "}
                                <Text
                                    color={theme.primaryColor}
                                    inherit={true}
                                    component="span"
                                >
                                    {`${e.weight}%`}
                                </Text>{" "}
                                súlyú
                            </Text>
                        );
                    case "loloReceive":
                        return (
                            <Text color="dimmed" size="sm" key={e.id}>
                                Kaptál egy új Loló érmét ezzel az okkal:{" "}
                                <Text
                                    color={theme.primaryColor}
                                    inherit={true}
                                    component="span"
                                >
                                    {e.reasonBody
                                        ? `${e.reasonText.substr(
                                              0,
                                              e.reasonText.length - 1
                                          )} (${e.reasonBody})`
                                        : e.reasonText.substr(
                                              0,
                                              e.reasonText.length - 1
                                          )}
                                </Text>{" "}
                            </Text>
                        );
                    case "itemBuy":
                        return (
                            <Text color="dimmed" size="sm" key={`${e.id}buy`}>
                                Vettél egy{" "}
                                <Text
                                    color={theme.primaryColor}
                                    inherit={true}
                                    component="span"
                                >
                                    {e.name}
                                </Text>
                                -t
                            </Text>
                        );
                    case "itemUse":
                        return (
                            <Text color="dimmed" size="sm" key={`${e.id}use`}>
                                Aktiváltál egy{" "}
                                <Text
                                    color={theme.primaryColor}
                                    inherit={true}
                                    component="span"
                                >
                                    {e.name}
                                </Text>
                                -t
                            </Text>
                        );
                }
            });
        };

        return formattedGroupedData.map((e) => {
            return (
                <Timeline.Item
                    bullet={<CalendarEvent size={18} />}
                    title={e.date}
                    key={e.date}
                >
                    {getRenderedEvents(e.events)}
                </Timeline.Item>
            );
        });
    };

    return (
        <Timeline bulletSize={32} lineWidth={2} m={10}>
            {getTimelineItems()}
        </Timeline>
    );
};

export default HomeTimeline;
