import React from "react";
import AuthLayout from "../../Layouts/Auth";
import HeaderCard from "../../Components/HeaderCard";
import DataTable from "react-data-table-component";
import {
    Container,
    Col,
    Row,
    Card,
    CardBody,
    Badge,
    ButtonGroup,
    Button as RSButton,
} from "reactstrap";
import { Button, useTheme, Modal, Text, Input } from "@nextui-org/react";
import TableLoader from "../../Components/TableLoader";
import toast from "react-hot-toast";
import EmptyTable from "../../Components/EmptyTable";
import { useBlueboardClient } from "blueboard-client-react";
import {
    BlueboardClient,
    BlueboardLoloRequest,
    BlueboardLoloRequestAction,
} from "blueboard-client";
import { eventDeclaration, useStatefulEvent, useStatefulListener } from "../../Hooks/EventHooks";
import { FormElement } from "@nextui-org/react/esm/input/input-props";
import Middleware from "../../Helpers/Middleware";

const RequestModalContent = ({
    client,
    callback,
    closeHandler,
    request,
}: {
    client: BlueboardClient;
    callback(): void;
    closeHandler(): void;
    request: eventDeclaration<BlueboardLoloRequest>;
}): JSX.Element => {
    const requestState = useStatefulListener(request);

    const [loloCount, setLoloCount] = React.useState(1);
    const [verdict, setVerdict] = React.useState<BlueboardLoloRequestAction>(0);

    const [errors, setErrors] = React.useState<{ [key: string]: string[] }>({});
    const [savePending, setSavePending] = React.useState(false);

    const getErrors = (inputName: string): string => {
        const err = errors ?? ({} as { [key: string]: string[] });

        const error = err[inputName] ?? [];
        let str = "";
        error.forEach((el: string) => {
            str = `${str + el}\n`;
        });

        return str;
    };

    const send = React.useCallback(() => {
        setSavePending(true);
        setErrors({});
        client.lolo_request
            .update(requestState.id, verdict, loloCount)
            .then(() => {
                toast.success("Kérvény sikeresen frissítve!");
                setSavePending(false);
                closeHandler();
                callback();
            })
            .catch((err) => {
                setSavePending(false);
                if (err.errors !== undefined) {
                    setErrors(err.errors);
                } else {
                    toast.error(err.message);
                }
            });
    }, [loloCount, verdict, requestState, client, callback, closeHandler]);

    return (
        <>
            <Modal.Header style={{ border: "none" }}>
                <Text id="modal-title" size={18}>
                    Kérvény - {requestState.title}
                </Text>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col xs="4" md="2">
                        Törzsszöveg:
                    </Col>
                    <Col>
                        <Text p={true}> {requestState.body} </Text>
                    </Col>
                </Row>
                <Row>
                    <Col md="6">
                        <ButtonGroup>
                            <RSButton
                                disabled={savePending}
                                active={verdict === BlueboardLoloRequestAction.accept}
                                color={
                                    verdict === BlueboardLoloRequestAction.accept
                                        ? "success"
                                        : "secondary"
                                }
                                onClick={() => setVerdict(BlueboardLoloRequestAction.accept)}>
                                Jóváhagyás
                            </RSButton>
                            <RSButton
                                disabled={savePending}
                                active={verdict === BlueboardLoloRequestAction.deny}
                                color={
                                    verdict === BlueboardLoloRequestAction.deny
                                        ? "danger"
                                        : "secondary"
                                }
                                onClick={() => setVerdict(BlueboardLoloRequestAction.deny)}>
                                Elutasítás
                            </RSButton>
                        </ButtonGroup>
                    </Col>
                </Row>
                {verdict === BlueboardLoloRequestAction.accept ? (
                    <>
                        <Row>
                            <Col xs="4" md="2">
                                Jóváhagyott összeg:
                            </Col>
                            <Col>
                                <Input
                                    fullWidth={true}
                                    bordered={true}
                                    underlined={true}
                                    disabled={savePending}
                                    type="number"
                                    min="1"
                                    shadow={false}
                                    onChange={(e: React.ChangeEvent<FormElement>) =>
                                        setLoloCount(Number(e.target.value))
                                    }
                                    labelRight="LoLó"
                                    initialValue={String(loloCount)}
                                    color={getErrors("loloAmount") === "" ? "primary" : "error"}
                                    status={getErrors("loloAmount") === "" ? "default" : "error"}
                                    helperColor={
                                        getErrors("loloAmount") === "" ? "default" : "error"
                                    }
                                    helperText={getErrors("loloAmount")}
                                />
                            </Col>
                        </Row>
                    </>
                ) : (
                    <></>
                )}
            </Modal.Body>
            <Modal.Footer style={{ overflow: "visible", border: "none" }}>
                <Button auto={true} rounded={true} flat={true} color="error" onClick={closeHandler}>
                    Mégsem
                </Button>
                <Button
                    auto={true}
                    rounded={true}
                    color="success"
                    flat={true}
                    onClick={send}
                    loading={savePending}
                    loaderType="points">
                    Küldés
                </Button>
            </Modal.Footer>
        </>
    );
};

const Requests = (): JSX.Element => {
    const [requests, setRequests] = React.useState<BlueboardLoloRequest[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [show, setShow] = React.useState(false);

    const closeHandler = React.useCallback(() => {
        setShow(false);
    }, []);

    const theme = useTheme();
    const client = useBlueboardClient();

    const bootstrap = React.useCallback(() => {
        setLoading(true);
        client.lolo_request
            .all()
            .then((res) => {
                setRequests(res);
                setLoading(false);
            })
            .catch((err) => toast.error(err.message));
    }, [client]);

    // eslint-disable-next-line
    const [requestRef, setRequest, eventDecl] = useStatefulEvent<BlueboardLoloRequest>(
        {} as BlueboardLoloRequest,
        "loloRequestEvent",
    );

    React.useEffect(bootstrap, [bootstrap]);

    const columns = [
        {
            name: "ID",
            selector: (row: BlueboardLoloRequest) => row.id,
        },
        {
            name: "Cím",
            selector: (row: BlueboardLoloRequest) => row.title,
        },
        {
            name: "Diák neve",
            selector: (row: BlueboardLoloRequest) => row.user?.name ?? "",
        },
        {
            name: "Diák e-mail címe",
            selector: (row: BlueboardLoloRequest) => row.user?.email ?? "",
        },
        {
            name: "Benyújtás ideje",
            cell: (row: BlueboardLoloRequest) => {
                const unix = Date.parse(row.timestamps.createdAt);
                const date = new Date(unix);
                return date.toLocaleString();
            },
        },
        {
            name: "",
            cell: (row: BlueboardLoloRequest) => {
                if (row.acceptedAt !== null) {
                    return (
                        <Badge color="success" pill={true}>
                            Elfogadva ({row.acceptedAt})
                        </Badge>
                    );
                }
                if (row.deniedAt !== null) {
                    return (
                        <Badge color="danger" pill={true}>
                            Elutasítva ({row.deniedAt})
                        </Badge>
                    );
                }

                return (
                    <Middleware
                        permission="Requests.overrule"
                        displayError={false}
                        component={
                            <Button
                                auto={true}
                                rounded={true}
                                onClick={() => {
                                    setRequest(row);
                                    setShow(true);
                                }}
                                color="gradient">
                                Elbírálás
                            </Button>
                        }
                    />
                );
            },
        },
    ];

    return (
        <AuthLayout>
            <Modal
                closeButton={true}
                blur={true}
                aria-labelledby="modal-title"
                open={show}
                onClose={closeHandler}
                preventClose={true}
                width="650px">
                <RequestModalContent
                    closeHandler={closeHandler}
                    request={eventDecl}
                    client={client}
                    callback={bootstrap}
                />
            </Modal>
            <HeaderCard title="LoLó kérvények" />
            <Container fluid={true} style={{ width: "95%" }}>
                <Row className="ml-2 mr-2">
                    <Col md="12">
                        <Card
                            style={{
                                background:
                                    theme.type === "dark"
                                        ? theme.palette.accents_1
                                        : theme.palette.background,
                            }}>
                            <CardBody
                                style={{
                                    height: "calc(100vh - 320px)",
                                }}>
                                <DataTable
                                    highlightOnHover={true}
                                    pointerOnHover={true}
                                    columns={columns}
                                    data={requests}
                                    theme={theme.type}
                                    progressPending={loading}
                                    progressComponent={<TableLoader />}
                                    noDataComponent={<EmptyTable />}
                                    fixedHeader={true}
                                    fixedHeaderScrollHeight="calc(100vh - 350px)"
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </AuthLayout>
    );
};

export default Requests;
