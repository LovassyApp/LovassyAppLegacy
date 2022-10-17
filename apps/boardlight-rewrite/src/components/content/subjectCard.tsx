import { Box, Title, createStyles } from "@mantine/core";

import { BlueboardKretaGradeData } from "blueboard-client";

const useStyles = createStyles((theme) => ({
    container: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
    },
}));

export const SubjectCard = ({ data }: { data: BlueboardKretaGradeData }): JSX.Element => {
    const { classes } = useStyles();

    return (
        <Box className={classes.container}>
            <Title order={5}>{data.subject}</Title>
        </Box>
    );
};
