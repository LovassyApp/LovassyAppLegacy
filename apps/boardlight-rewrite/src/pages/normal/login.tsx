import {
    Box,
    Button,
    Center,
    Checkbox,
    PasswordInput,
    Text,
    TextInput,
    Title,
    createStyles,
} from "@mantine/core";
import { Lock, Mail } from "tabler-icons-react";

import { getRandomTipp } from "../../utils/misc/tippsUtils";
import { setControl } from "../../store/slices/controlSlice";
import { setToken } from "../../store/slices/tokenSlice";
import { useBlueboardClient } from "blueboard-client-react";
import { useDispatch } from "react-redux";
import { useInputState } from "@mantine/hooks";
import { useLoading } from "../../hooks/useLoading";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@mantine/notifications";

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

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            width: "75vw",
        },
    },
    input: {
        marginBottom: theme.spacing.sm,
    },
    buttonContainer: {
        width: "100%",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
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

                loading(false, "");

                dispatch(setToken(res.token));
                navigate("/home");
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
                setPasswordError(err.response.data.errors.password ?? "");
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
                        className={classes.input}
                        onChange={setEmail}
                    />
                    {/* required prop doesn't work rn, waiting on mantine to fix this */}
                    <PasswordInput
                        label="Jelszó"
                        variant="filled"
                        icon={<Lock size={20} />}
                        required={true}
                        value={password}
                        error={passwordError}
                        className={classes.input}
                        onChange={setPassword}
                    />
                    <Checkbox
                        label="Nefelejts pipa"
                        checked={remember}
                        className={classes.input}
                        onChange={setRemember}
                    />

                    <Box className={classes.buttonContainer}>
                        <Button type="submit">Bejelentkezés</Button>
                    </Box>
                </form>
            </Box>
        </Center>
    );
};
