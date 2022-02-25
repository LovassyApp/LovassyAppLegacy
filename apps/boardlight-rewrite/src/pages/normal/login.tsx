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

import { useBlueboardClient } from "blueboard-client-react";
import { useInputState } from "@mantine/hooks";
import { useLoading } from "../../hooks/useLoading";

const useStyles = createStyles((theme) => ({
    input: {
        marginBottom: theme.spacing.sm,
    },
    buttonContainer: {
        width: "100%",
        display: "flex",
        justifyContent: "flex-end",
    },
}));

export const Login = (): JSX.Element => {
    const [email, setEmail] = useInputState("");
    const [password, setPassword] = useInputState("");
    const [remember, setRemember] = useInputState(false);

    const loading = useLoading();
    const client = useBlueboardClient();

    const { classes } = useStyles();

    const doLogin = async (): Promise<void> => {
        loading(true, "Belépés folyamatban...");

        try {
            const res = await client.auth.login(email, password, remember);
            console.log(res);
        } catch {
            console.log("Error");
        }
    };

    return (
        <Center sx={{ height: "100vh" }}>
            <Box sx={{ width: "30vw" }}>
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
                        className={classes.input}
                        onChange={setEmail}
                    />
                    <PasswordInput
                        label="Jelszó"
                        variant="filled"
                        icon={<Lock size={20} />}
                        required={true}
                        value={password}
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
