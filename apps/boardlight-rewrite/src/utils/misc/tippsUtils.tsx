import { Kbd, Text } from "@mantine/core";

const tipps: JSX.Element[] = [
    <>
        <Text color="gray" mr={3}>
            Tipp: Használd a{" "}
        </Text>
        <Kbd mr={3}>Ctrl</Kbd>
        <Text color="gray" mr={3}>
            +
        </Text>
        <Kbd mr={3}>J</Kbd>
        <Text color="gray"> kombinációt a téma megváltoztatásához.</Text>
    </>,
];

export const getRandomTipp = (): JSX.Element => {
    const randomIndex = Math.floor(Math.random() * tipps.length);
    return tipps[randomIndex];
};
