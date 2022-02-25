import { Box, createStyles } from "@mantine/core";

import { useViewportSize } from "@mantine/hooks";

const useStyles = createStyles(() => ({
    content: {
        width: "100%",
    },
}));

// This only really exists so we can mess around with it in the future if we need to
export const NormalLayout = ({ children }: { children: React.ReactNode }): JSX.Element => {
    const { classes } = useStyles();

    return <Box className={classes.content}>{children}</Box>;
};
