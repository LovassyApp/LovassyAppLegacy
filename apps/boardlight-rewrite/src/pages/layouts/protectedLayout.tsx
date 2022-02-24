import {
    AppShell,
    Box,
    Center,
    createStyles,
    Drawer,
    Header,
    MediaQuery,
    Tabs,
    Text,
    UnstyledButton,
} from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu2, Home, Book } from "tabler-icons-react";
import { ColorSwitch } from "../../components/colorSwitch";

const useStyles = createStyles((theme) => ({
    header: {
        display: "flex",
        alignItems: "center",
    },
    drawerLowerPortion: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "absolute",
        bottom: 0,
        padding: theme.spacing.xl,
        width: "80%",
    },
    navBarCenter: {
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
    },
    navBarRight: {
        position: "absolute",
        margin: 10,
        right: 0,
    },
}));

const NavbarLinks = ({ drawer }: { drawer?: boolean }): JSX.Element => {
    const navigate = useNavigate();
    const location = useLocation();

    const linksArray: string[] = ["/home", "/kreta"];

    const tabChangeCallback = (index: number): void => {
        navigate(linksArray[index]);
    };

    return (
        <Tabs
            onTabChange={(index) => tabChangeCallback(index)}
            variant="pills"
            orientation={drawer ? "vertical" : "horizontal"}
            initialTab={linksArray.indexOf(location.pathname)}
            styles={{
                tabControl: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                },
            }}>
            <Tabs.Tab label="Kezdőlap" icon={<Home size={16} />} />
            <Tabs.Tab label="Kréta" icon={<Book size={16} />} />
        </Tabs>
    );
};

export const ProtectedLayout = ({ children }: { children: React.ReactNode }): JSX.Element => {
    const [opened, setOpened] = useState(false);

    const { classes } = useStyles();

    return (
        <AppShell
            padding="md"
            fixed={true}
            header={
                <Header height={60} padding="xs" className={classes.header}>
                    <Text
                        variant="gradient"
                        gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                        weight="bold"
                        size="xl"
                        mr={10}>
                        LovassyApp
                    </Text>
                    <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                        <UnstyledButton
                            onClick={() => setOpened(!opened)}
                            className={classes.navBarRight}>
                            <Menu2 size={24} />
                        </UnstyledButton>
                    </MediaQuery>
                    <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                        <Box className={classes.navBarCenter}>
                            <NavbarLinks />
                        </Box>
                    </MediaQuery>
                    <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                        <Box className={classes.navBarRight}>
                            <ColorSwitch />
                        </Box>
                    </MediaQuery>
                </Header>
            }
            styles={(theme) => ({
                main: {
                    backgroundColor:
                        theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
                },
            })}>
            <Drawer
                opened={opened}
                onClose={() => setOpened((o) => !o)}
                size="md"
                padding="xl"
                position="right"
                title="Navigáció">
                <Center>
                    <NavbarLinks drawer={true} />
                    <Box className={classes.drawerLowerPortion}>
                        <Text>Téma</Text>
                        <ColorSwitch />
                    </Box>
                </Center>
            </Drawer>
            {children}
        </AppShell>
    );
};
