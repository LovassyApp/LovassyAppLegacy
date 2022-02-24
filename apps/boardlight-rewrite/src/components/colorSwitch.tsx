import { ColorScheme, createStyles, UnstyledButton, useMantineColorScheme } from "@mantine/core";
import { Sun, MoonStars } from "tabler-icons-react";

const useStyles = createStyles((theme, colorScheme: ColorScheme) => ({
    colorSwitch: {
        backgroundColor: colorScheme === "dark" ? theme.colors.yellow[2] : theme.colors.dark[4],
        color: colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.blue[3],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
        borderRadius: "50%",
    },
}));

export const ColorSwitch = (): JSX.Element => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    const { classes } = useStyles(colorScheme);

    return (
        <UnstyledButton onClick={() => toggleColorScheme()} className={classes.colorSwitch}>
            {colorScheme === "dark" ? <Sun /> : <MoonStars />}
        </UnstyledButton>
    );
};
