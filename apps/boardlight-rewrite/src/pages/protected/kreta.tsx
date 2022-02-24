import { useSelector } from "react-redux";
import { Box, Button, Paper, Text } from "@mantine/core";
import { RootState } from "../../store/store";

export const Kreta = (): JSX.Element => {
    const token = useSelector((state: RootState) => state.token.value);

    return <Box />;
};
