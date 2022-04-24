import {
    Badge,
    Box,
    Center,
    Group,
    Progress,
    RingProgress,
    Stack,
    Text,
    Title,
    createStyles,
    useMantineTheme,
} from "@mantine/core";

import { BlueboardLoloReason } from "blueboard-client";
import { RootState } from "../../store/store";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useUser } from "../../hooks/controlHooks";

class CoinOrigins {
    public constructor(
        public fromFive: number,
        public fromFour: number,
        public fromRequest: number,
    ) {}
}

const useStyles = createStyles(() => ({
    progressBadgeDot: {
        borderWidth: 0,
    },
}));

const HomeStats = (): JSX.Element => {
    const { classes } = useStyles();
    const theme = useMantineTheme();

    const coins = useSelector((state: RootState) => state.coins.value);
    const gradeData = useSelector((state: RootState) => state.kreta.gradeData);
    const user = useUser();

    const coinOrigins = useMemo(() => {
        let fiveCount = 0;
        let fourCount = 0;
        let requestCount = 0;

        for (const coin of coins) {
            switch (coin.reason) {
                case BlueboardLoloReason.FromFive:
                    fiveCount++;
                    break;
                case BlueboardLoloReason.FromFour:
                    fourCount++;
                    break;
                case BlueboardLoloReason.FromRequest:
                    requestCount++;
                    break;
            }
        }

        return new CoinOrigins(fiveCount, fourCount, requestCount);
    }, [coins]);

    const avg = useMemo(() => {
        let sum = 0;
        let num = 0;
        for (const subject of gradeData) {
            for (const grade of subject.grades) {
                num++;
                sum += grade.grade;
            }
        }

        return sum / num;
    }, [gradeData]);

    return (
        <>
            <Title order={3}>Statisztikák</Title>

            <Progress
                size="xl"
                sections={[
                    {
                        value: Math.round((user.balance / coins.length) * 100),
                        label: `${user.balance}`,
                        color: "cyan",
                    },
                    {
                        value: Math.round(((coins.length - user.balance) / coins.length) * 100),
                        label: `${coins.length - user.balance}`,
                        color: "blue",
                    },
                ]}
                mt={10}
                mb={5}
            />

            <Stack align="flex-start" spacing={0}>
                <Badge variant="dot" color="cyan" classNames={{ dot: classes.progressBadgeDot }}>
                    Elérhető érmék ({user.balance})
                </Badge>
                <Badge variant="dot" color="blue" classNames={{ dot: classes.progressBadgeDot }}>
                    Elköltött érmék ({coins.length - user.balance})
                </Badge>
            </Stack>

            <Progress
                size="xl"
                sections={[
                    {
                        value: Math.round((coinOrigins.fromFive / coins.length) * 100),
                        label: `${coinOrigins.fromFive}`,
                        color: "pink",
                    },
                    {
                        value: Math.round((coinOrigins.fromFour / coins.length) * 100),
                        label: `${coinOrigins.fromFour}`,
                        color: "grape",
                    },
                    {
                        value: Math.round((coinOrigins.fromRequest / coins.length) * 100),
                        label: `${coinOrigins.fromRequest}`,
                        color: "violet",
                    },
                ]}
                mt={10}
                mb={5}
            />

            <Stack align="flex-start" spacing={0}>
                <Badge variant="dot" color="pink" classNames={{ dot: classes.progressBadgeDot }}>
                    Érmék ötösökből ({coinOrigins.fromFive})
                </Badge>
                <Badge variant="dot" color="grape" classNames={{ dot: classes.progressBadgeDot }}>
                    Érmék négyesekből ({coinOrigins.fromFour})
                </Badge>
                <Badge variant="dot" color="violet" classNames={{ dot: classes.progressBadgeDot }}>
                    Érmék kérvényekből ({coinOrigins.fromRequest})
                </Badge>
            </Stack>
            <Center>
                <Group>
                    <Title order={4}>Tanulmányi átlag</Title>

                    <RingProgress
                        sections={[{ value: (avg / 5) * 100, color: theme.primaryColor }]}
                        roundCaps={true}
                        label={
                            <Text align="center" weight="bold" color={theme.primaryColor}>
                                {Math.round(avg * 100) / 100}
                            </Text>
                        }
                    />
                </Group>
            </Center>
        </>
    );
};

export default HomeStats;
