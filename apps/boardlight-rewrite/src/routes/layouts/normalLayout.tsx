import { Box, createStyles } from "@mantine/core";

import { getRandomTipp } from "../../utils/misc/tippsUtils";

const useStyles = createStyles((theme) => ({
    content: {
        width: "100%",
        height: "95vh",

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            height: "100vh",
        },
    },
    tipps: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "row",

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            display: "none",
        },
    },
}));

export const NormalLayout = ({ children }: { children: React.ReactNode }): JSX.Element => {
    const { classes } = useStyles();

    return (
        <Box className={classes.content}>
            {children}
            <Box className={classes.tipps}>{getRandomTipp()}</Box>
        </Box>
    );
};
