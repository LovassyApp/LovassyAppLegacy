import { Box, ColorScheme, createStyles, useMantineColorScheme } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";

const useStyles = createStyles((theme, viewportHeight: number) => ({
    content: {
        minHeight: viewportHeight,
        width: "100%",
    },
}));

export const NormalLayout = ({ children }: { children: React.ReactNode }): JSX.Element => {
    const { height: viewportHeight } = useViewportSize();

    const { classes } = useStyles(viewportHeight);

    return <Box className={classes.content}>{children}</Box>;
};
