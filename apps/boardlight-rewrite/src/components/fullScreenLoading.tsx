import {
    Box,
    Center,
    ColorScheme,
    createStyles,
    Loader,
    Text,
    useMantineColorScheme,
} from "@mantine/core";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const useStyles = createStyles((theme, colorScheme: ColorScheme) => ({
    container: {
        position: "fixed",
        top: 0,
        left: 0,
        height: "100%",
        zIndex: 1000,
        width: "100%",
        backgroundColor: colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.white,
    },
    content: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
}));

export const FullScreenLoading = (): JSX.Element => {
    const loadingMessage = useSelector((state: RootState) => state.loading.message);

    const { colorScheme } = useMantineColorScheme();
    const { classes } = useStyles(colorScheme);

    return (
        <Center className={classes.container}>
            <Box className={classes.content}>
                <Loader variant="bars" size="xl" mb={20} />
                <Text color="gray" align="center">
                    {loadingMessage}
                </Text>
            </Box>
        </Center>
    );
};
