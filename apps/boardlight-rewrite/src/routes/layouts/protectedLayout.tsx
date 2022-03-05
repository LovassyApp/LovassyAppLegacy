import {
    AppShell,
    Avatar,
    Box,
    Center,
    Drawer,
    Header,
    MediaQuery,
    Menu,
    Tabs,
    Text,
    UnstyledButton,
    createStyles,
    useMantineColorScheme,
    useMantineTheme,
} from "@mantine/core";
import { Book, Coin, Home, InfoCircle, Logout, Menu2, Paint } from "tabler-icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

import { useLogout } from "../../hooks/useLogout";
import { useModals } from "@mantine/modals";
import { useUser } from "../../hooks/controlHooks";

const useStyles = createStyles((theme) => ({
    header: {
        display: "flex",
        alignItems: "center",
    },
    drawerLowerPortion: {
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        bottom: 0,
        padding: theme.spacing.xl,
        width: "100%",
    },
    navBarCenter: {
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
    },
    navBarRight: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        position: "absolute",
        marginRight: 10,
        right: 0,
    },
    drawerItem: {
        display: "flex",
        justifyContent: "center",
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
    const [menuOpened, setMenuOpened] = useState(false);

    const user = useUser();
    const logout = useLogout();
    const theme = useMantineTheme();
    const modals = useModals();
    const { toggleColorScheme } = useMantineColorScheme();

    const { classes } = useStyles();

    const openAccountInformation = (): void => {
        setMenuOpened(false);
        modals.openModal({
            title: "Fiók információk",
            children: (
                <>
                    <Text>Azonosító: {user.id}</Text>
                </>
            ),
        });
    };

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
                        <Box className={classes.navBarRight}>
                            <Text
                                size="sm"
                                color={theme.colors.yellow[6]}
                                weight="bolder"
                                mr={3}
                                mt={-3.5}>
                                {user.balance}
                            </Text>
                            <Box mr={10} mt={3.5}>
                                <Coin color={theme.colors.yellow[6]} />
                            </Box>
                            <UnstyledButton onClick={() => setOpened(!opened)}>
                                <Menu2 size={32} />
                            </UnstyledButton>
                        </Box>
                    </MediaQuery>
                    <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                        <Box className={classes.navBarCenter}>
                            <NavbarLinks />
                        </Box>
                    </MediaQuery>
                    <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                        <Box className={classes.navBarRight}>
                            <Text size="sm" color={theme.colors.yellow[6]} weight="bolder" mr={3}>
                                {user.balance}
                            </Text>
                            <Box mr={10} mt={7}>
                                <Coin color={theme.colors.yellow[6]} />
                            </Box>
                            <Menu
                                closeOnItemClick={false}
                                opened={menuOpened}
                                onOpen={() => setMenuOpened(true)}
                                onClose={() => setMenuOpened(false)}
                                control={
                                    <Avatar radius="xl" color={theme.primaryColor}>
                                        {user.name
                                            .split(" ")
                                            .map((item) => item[0])
                                            .join("")}
                                    </Avatar>
                                }>
                                <Menu.Label>Kinézet</Menu.Label>
                                <Menu.Item icon={<Paint />} onClick={() => toggleColorScheme()}>
                                    Téma váltás
                                </Menu.Item>
                                <Menu.Label>Fiók</Menu.Label>
                                <Menu.Item
                                    icon={<InfoCircle />}
                                    color="blue"
                                    onClick={() => openAccountInformation()}>
                                    Fiók információk
                                </Menu.Item>
                                <Menu.Item icon={<Logout />} color="red" onClick={() => logout()}>
                                    Kijelentkezés
                                </Menu.Item>
                            </Menu>
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
                        <Menu.Item
                            icon={<Paint />}
                            onClick={() => toggleColorScheme()}
                            className={classes.drawerItem}>
                            Téma váltás
                        </Menu.Item>
                        <Menu.Item
                            icon={<InfoCircle />}
                            color="blue"
                            onClick={() => openAccountInformation()}
                            className={classes.drawerItem}>
                            Fiók információk
                        </Menu.Item>
                        <Menu.Item
                            icon={<Logout />}
                            color="red"
                            onClick={() => logout()}
                            className={classes.drawerItem}>
                            Kijelentkezés
                        </Menu.Item>
                    </Box>
                </Center>
            </Drawer>
            {children}
        </AppShell>
    );
};
