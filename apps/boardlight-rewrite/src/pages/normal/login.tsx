import { Box, Button, Center, Checkbox, Paper, Text, TextInput } from "@mantine/core";
import { useForm, useInputState } from "@mantine/hooks";

import { useBlueboardClient } from "blueboard-client-react";
import { useLoading } from "../../hooks/useLoading";

export const Login = (): JSX.Element => {
    const [email, setEmail] = useInputState("");
    const [password, setPassword] = useInputState("");
    const [remember, setRemember] = useInputState(false);

    const loading = useLoading();
    const client = useBlueboardClient();

    const doLogin = async (): Promise<void> => {
        loading(true, "Belépés folyamatban...");

        try {
            const res = await client.auth.login(email, password, remember);
        } catch {
            console.log("Error");
        }
    };

    return (
        <Center sx={{ height: "100vh" }}>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                }}>
                <TextInput label="Email" required={true} value={email} onChange={setEmail} />
                <TextInput label="Jelszó" required={true} value={password} onChange={setPassword} />
                <Checkbox label="Nefelejts pipa" checked={remember} onChange={setRemember} />

                <Button type="submit">Bejelentkezés</Button>
            </form>
        </Center>
    );
};
