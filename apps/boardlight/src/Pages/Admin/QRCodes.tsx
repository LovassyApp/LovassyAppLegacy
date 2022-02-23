import * as React from "react";
import AuthLayout from "../../Layouts/Auth";
import HeaderCard from "../../Components/HeaderCard";
import {
    Container,
    Grid,
    Card,
    Row,
    Text,
    Input,
    Button,
    NextUIThemes,
    useTheme,
} from "@nextui-org/react";
import TableLoader from "../../Components/TableLoader";
import { MdAdd } from "react-icons/md";
import EmptyTable from "../../Components/EmptyTable";
import { Popover, PopoverBody, Alert, UncontrolledTooltip } from "reactstrap";
import deleteModal from "../../Helpers/DeleteModal";
import toast from "react-hot-toast";
import { useBlueboardClient } from "blueboard-client-react";
import { BlueboardQRCode } from "blueboard-client";
import Center from "../../Components/Center";
import Middleware from "../../Helpers/Middleware";

const QRCard = ({
    code,
    deleteCallback,
}: {
    code: BlueboardQRCode;
    deleteCallback(code: BlueboardQRCode, theme: NextUIThemes): void;
}): JSX.Element => {
    const theme = useTheme();
    return (
        <Grid>
            <Card hoverable={true} clickable={true}>
                <Card.Body
                    onClick={() => {
                        const link = document.createElement("a");
                        link.href = code.image;
                        link.download = "code.png";
                        document.body.appendChild(link);
                        link.click();
                    }}
                    noPadding={true}>
                    <Card.Image
                        objectFit="cover"
                        autoResize={false}
                        src={code.image}
                        style={{ height: "200px", width: "200px" }}
                        // height={200}
                        // width={200}
                        alt="code"
                    />
                </Card.Body>
                <Card.Footer
                    style={{
                        background:
                            theme.type === "dark"
                                ? theme.palette.accents_1
                                : theme.palette.background,
                    }}
                    // @ts-ignore
                    justify="flex-start">
                    <Row justify="space-between">
                        <Text
                            b={true}
                            style={{
                                maxWidth: "100px",
                            }}>
                            <span id={`tooltip-${code.id}`}>{code.name}</span>
                            <UncontrolledTooltip placement="bottom" target={`tooltip-${code.id}`}>
                                Értesített E-mail: {code.email}
                            </UncontrolledTooltip>
                        </Text>
                    </Row>
                    <Middleware
                        permission="QRCode.delete"
                        displayError={false}
                        component={
                            <Button
                                type="button"
                                size="mini"
                                role="button"
                                tabIndex={0}
                                auto={true}
                                rounded={true}
                                color="error"
                                onClick={() => {
                                    deleteCallback(code, theme);
                                }}>
                                Törlés
                            </Button>
                        }
                    />
                </Card.Footer>
            </Card>
        </Grid>
    );
};

const AddCard = ({ bootstrap }: { bootstrap(): void }): JSX.Element => {
    const [popover, setPopover] = React.useState(false);
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [errorShow, setErrorShow] = React.useState(false);
    const [errors, setErrors] = React.useState<{ [key: string]: string[] }>({});
    const [savePending, setSavePending] = React.useState(false);
    const client = useBlueboardClient();

    const togglePopover = (): void => {
        setName("");
        setEmail("");
        setErrorShow(false);
        setErrors({});
        return setPopover(!popover);
    };

    const trySave = (): void => {
        setSavePending(true);
        client.qrcodes
            .save(name, email)
            .then(() => {
                setSavePending(false);
                bootstrap();
                togglePopover();
            })
            .catch((err) => {
                setSavePending(false);
                if (err.errors !== undefined) {
                    setErrors(err.errors);
                } else {
                    setErrors({ general: [err.message] });
                    setErrorShow(true);
                }
            });
    };

    const getErrors = (inputName: string): string => {
        const error = errors[inputName] ?? [];
        let str = "";
        error.forEach((el: string) => {
            str = `${str + el}\n`;
        });

        return str;
    };

    const theme = useTheme();

    return (
        <>
            <Popover flip={true} isOpen={popover} placement="top" target="addCodeCard">
                <PopoverBody
                    style={{
                        background:
                            theme.type === "dark"
                                ? theme.palette.accents_1
                                : theme.palette.background,
                    }}>
                    <Input
                        fullWidth={true}
                        className="mt-2"
                        clearable={true}
                        bordered={true}
                        underlined={true}
                        color={getErrors("name") === "" ? "primary" : "error"}
                        status={getErrors("name") === "" ? "default" : "error"}
                        helperColor={getErrors("name") === "" ? "default" : "error"}
                        helperText={getErrors("name")}
                        shadow={false}
                        onChange={(e) => setName(e.target.value)}
                        labelLeft="Név: "
                        initialValue={name}
                    />
                    <Input
                        fullWidth={true}
                        className="mt-2"
                        clearable={true}
                        bordered={true}
                        underlined={true}
                        type="email"
                        color={getErrors("email") === "" ? "primary" : "error"}
                        status={getErrors("email") === "" ? "default" : "error"}
                        helperColor={getErrors("email") === "" ? "default" : "error"}
                        helperText={getErrors("email")}
                        shadow={false}
                        onChange={(e) => setEmail(e.target.value)}
                        labelLeft="E-mail: "
                        initialValue={email}
                    />
                    <Alert
                        className="mt-2"
                        color="danger"
                        isOpen={errorShow}
                        toggle={() => setErrorShow(false)}>
                        {getErrors("general")}
                    </Alert>
                    <Center>
                        <Button
                            auto={true}
                            className="mt-4"
                            loading={savePending}
                            loaderType="points"
                            color="gradient"
                            rounded={true}
                            onClick={trySave}>
                            Mentés
                        </Button>
                    </Center>
                </PopoverBody>
            </Popover>
            <Grid id="addCodeCard">
                <Card onClick={togglePopover} width="100%" hoverable={true} clickable={true}>
                    <Card.Body noPadding={true} height="200px" width="200px">
                        <Row justify="center" className="h-100" align="center">
                            <MdAdd size="100" />
                        </Row>
                    </Card.Body>
                    <Card.Footer
                        style={{
                            background:
                                theme.type === "dark"
                                    ? theme.palette.accents_1
                                    : theme.palette.background,
                        }}
                        // @ts-ignore
                        justify="flex-start">
                        <Row justify="space-between">
                            <Text b={true}>Kód hozzáadása</Text>
                        </Row>
                    </Card.Footer>
                </Card>
            </Grid>
        </>
    );
};

const QRCodes = (): JSX.Element => {
    const [loading, setLoading] = React.useState(true);
    const [qrCodes, setQrCodes] = React.useState<BlueboardQRCode[]>([]);
    const client = useBlueboardClient();

    const bootstrap = async (): Promise<void> => {
        setLoading(true);
        client.qrcodes
            .all()
            .then((res) => {
                setQrCodes(res);
                setLoading(false);
            })
            .catch((err) => toast.error(err.message));
    };

    React.useEffect(() => {
        bootstrap();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const deleteC = async (code: BlueboardQRCode, theme: NextUIThemes): Promise<void> => {
        const res = await deleteModal(
            "Biztos, hogy törölni szeretnéd ezt a kódot?",
            `Törlés - ${code.name}`,
            theme,
        );

        if (res.isConfirmed) {
            toast.promise(
                client.qrcodes.delete(code.id).then(() => bootstrap()),
                {
                    loading: "Törlés...",
                    success: "Sikeresen törölve!",
                    error: "Hiba történt!",
                },
            );
        }
    };

    return (
        <AuthLayout>
            <HeaderCard title="QR-kódok" />
            {loading ? (
                <Center>
                    <TableLoader />
                </Center>
            ) : (
                <Container>
                    <Center>{qrCodes.length === 0 ? <EmptyTable /> : null}</Center>
                    <Grid.Container gap={2} justify="center">
                        {qrCodes.map((el, key) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <QRCard key={key} deleteCallback={deleteC} code={el} />
                        ))}
                        <Middleware
                            permission="QRCode.add"
                            displayError={false}
                            component={<AddCard bootstrap={bootstrap} />}
                        />
                    </Grid.Container>
                </Container>
            )}
        </AuthLayout>
    );
};

export default QRCodes;
