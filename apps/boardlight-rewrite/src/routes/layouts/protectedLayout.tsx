import {
    AppShell,
    Avatar,
    Box,
    Center,
    Drawer,
    Header,
    MediaQuery,
    Menu,
    Paper,
    Space,
    Tabs,
    Text,
    UnstyledButton,
    createStyles,
    useMantineColorScheme,
    useMantineTheme,
} from "@mantine/core";
import {
    Book,
    Businessplan,
    Coin,
    Home,
    InfoCircle,
    Logout,
    Menu2,
    Paint,
} from "tabler-icons-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePermissions, useUser } from "../../hooks/controlHooks";

import { useLogout } from "../../hooks/useLogout";
import { useModals } from "@mantine/modals";

const useStyles = createStyles((theme) => ({
    header: {
        display: "flex",
        alignItems: "center",
        borderBottom: 0,
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
    balanceContainer: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
        marginRight: 10,
        padding: "4px 12px",
        borderRadius: theme.radius.md,
        display: "flex",
        alignItems: "center",
    },
}));

const NavbarLinks = ({ drawer }: { drawer?: boolean }): JSX.Element => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(0);

    const linksArray: string[] = ["/home", "/kreta"];

    useEffect(() => {
        setActiveTab(linksArray.indexOf(location.pathname));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    const tabChangeCallback = (index: number): void => {
        setActiveTab(index);
        navigate(linksArray[index]);
    };

    return (
        <Tabs
            onTabChange={(index) => tabChangeCallback(index)}
            variant="pills"
            orientation={drawer ? "vertical" : "horizontal"}
            active={activeTab}
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
    const permissions = usePermissions();
    const logout = useLogout();
    const theme = useMantineTheme();
    const modals = useModals();
    const { toggleColorScheme } = useMantineColorScheme();

    const { classes } = useStyles();

    const openAccountInformation = (): void => {
        setMenuOpened(false);
        setOpened(false);
        modals.openModal({
            title: "Fiók információk",
            children: (
                <>
                    <Text>Azonosító: {user.id}</Text>
                    <Text>Név: {user.name}</Text>
                    <Text>Email: {user.email}</Text>
                    <Space h="sm" />
                    <Text>
                        Készült: {user.timestamps.createdAt.split(".")[0].split("T").join(" ")}
                    </Text>
                    <Text>
                        Utoljára frissítve:{" "}
                        {user.timestamps.updatedAt.split(".")[0].split("T").join(" ")}
                    </Text>
                    <Space h="sm" />
                    <Text>Engedélyek: {permissions.join(", ")}</Text>
                </>
            ),
        });
    };

    return (
        <AppShell
            padding="md"
            fixed={true}
            header={
                <Header height={60} p="xs" className={classes.header}>
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
                            <Box className={classes.balanceContainer}>{`${user.balance} Loló`}</Box>
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
                            <Box className={classes.balanceContainer}>{`${user.balance} Loló`}</Box>
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
