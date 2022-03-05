import {
    Box,
    Button,
    Center,
    Checkbox,
    PasswordInput,
    TextInput,
    Title,
    createStyles,
} from "@mantine/core";
import { Lock, Mail } from "tabler-icons-react";

import { eagerLoad } from "../../utils/api/eagerLoad";
import { setControl } from "../../store/slices/controlSlice";
import { setToken } from "../../store/slices/tokenSlice";
import { useBlueboardClient } from "blueboard-client-react";
import { useDispatch } from "react-redux";
import { useInputState } from "@mantine/hooks";
import { useLoading } from "../../hooks/useLoading";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@mantine/notifications";
import { useRenew } from "../../hooks/useRenew";

const useStyles = createStyles((theme) => ({
    center: {
        height: "100%",
    },
    content: {
        width: "25vw",

        [`@media (max-width: ${theme.breakpoints.lg}px)`]: {
            width: "35vw",
        },

        [`@media (max-width: ${theme.breakpoints.md}px)`]: {
            width: "45vw",
        },

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            width: "65vw",
        },

        [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
            width: "75vw",
        },
    },
    emailInput: {
        marginBottom: theme.spacing.sm,
    },
    pwInput: {
        marginBottom: theme.spacing.lg,
    },
    buttonContainer: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
}));

export const Login = (): JSX.Element => {
    const [email, setEmail] = useInputState("");
    const [password, setPassword] = useInputState("");
    const [remember, setRemember] = useInputState(false);

    const [emailError, setEmailError] = useInputState("");
    const [passwordError, setPasswordError] = useInputState("");

    const dispatch = useDispatch();

    const loading = useLoading();
    const client = useBlueboardClient();
    const renew = useRenew();

    const notifications = useNotifications();
    const navigate = useNavigate();

    const { classes } = useStyles();

    const doLogin = async (): Promise<void> => {
        loading(true, "Bejelentkezés folyamatban...");
        setEmailError("");
        setPasswordError("");

        if (!email.endsWith("@lovassy.edu.hu")) {
            setEmailError("Az email címnek @lovassy.edu.hu - ra kell végződnie");
            loading(false, "");
            return;
        }

        try {
            const res = await client.auth.login(email, password, remember);
            try {
                loading(true, "Control lekérése...");
                const control = await client.account.control(res.token);

                dispatch(setControl(control));

                try {
                    await eagerLoad(client, res.token);
                    dispatch(setToken(res.token));
                    renew();
                    navigate("/home", { replace: true });
                } catch (err) {
                    notifications.showNotification({
                        title: "Hiba történt",
                        message: "A betöltés sikertelen",
                        color: "red",
                        autoClose: 5000,
                    });
                } finally {
                    loading(false, "");
                }
            } catch (err) {
                loading(false, "");
                notifications.showNotification({
                    title: "Hiba történt",
                    message: "A control lekérése sikertelen",
                    color: "red",
                    autoClose: 5000,
                });
            }
        } catch (err) {
            loading(false, "");
            console.log(err.errors);

            if (err.errors) {
                setEmailError(err.errors.email ?? "");
                setPasswordError(err.errors.password ?? "");
            } else if (err.message === "Bad credentials") {
                setEmailError("");
                setPasswordError("A megadott jelszó helytelen");
            } else {
                notifications.showNotification({
                    title: "Hiba történt",
                    message: err.message,
                    color: "red",
                    autoClose: 5000,
                });
            }
        }
    };

    return (
        <Center className={classes.center}>
            <Box className={classes.content}>
                <Title align="center">Bejelentkezés</Title>
                <form
                    onSubmit={(event) => {
                        doLogin();
                        event.preventDefault();
                    }}>
                    <TextInput
                        label="Email"
                        variant="filled"
                        icon={<Mail size={20} />}
                        required={true}
                        value={email}
                        error={emailError}
                        className={classes.emailInput}
                        onChange={setEmail}
                    />
                    <PasswordInput
                        label="Jelszó"
                        variant="filled"
                        icon={<Lock size={20} />}
                        required={true}
                        value={password}
                        error={passwordError}
                        className={classes.pwInput}
                        onChange={setPassword}
                    />

                    <Box className={classes.buttonContainer}>
                        <Checkbox
                            label="Nefelejts pipa"
                            checked={remember}
                            onChange={setRemember}
                        />
                        <Button type="submit">Bejelentkezés</Button>
                    </Box>
                </form>
            </Box>
        </Center>
    );
};
