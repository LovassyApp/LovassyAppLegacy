import * as React from "react";
import AuthLayout from "../../Layouts/Auth";
import HeaderCard from "../../Components/HeaderCard";
import { useHistory, useParams } from "react-router";
import { Loading, Input, Button, useTheme } from "@nextui-org/react";
import { Row, Col, CardBody, Card, Alert } from "reactstrap";
import { Container } from "@nextui-org/react";
import toast from "react-hot-toast";
import TableLoader from "../../Components/TableLoader";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useBlueboardClient } from "blueboard-client-react";
import { BlueboardNotFoundException, BlueboardUser, BlueboardUserGroup } from "blueboard-client";
import Center from "../../Components/Center";

const animatedComponents = makeAnimated();

const EditUser = (): JSX.Element => {
    const { id } = useParams() as { id: string };
    const history = useHistory();
    const theme = useTheme();
    const client = useBlueboardClient();

    if (isNaN(Number(id))) {
        history.push("/404");
    }

    const [loading, setLoading] = React.useState(true);
    const [savePending, setSavePending] = React.useState(false);

    type DropGroupArray = Array<{ value: string | number; label: string }>;

    const [allGroups, setAllGroups] = React.useState<DropGroupArray>([]);
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [groups, setGroups] = React.useState<DropGroupArray>([]);

    const [GLOBERR, setGLOBERR] = React.useState("");
    const [nameErr, setNameErr] = React.useState<string[]>([]);
    const [emailErr, setEmailErr] = React.useState<string[]>([]);

    const [globIsVisible, globSetVisible] = React.useState(false);
    const [nameIsVisible, nameSetVisible] = React.useState(false);
    const [emailIsVisible, emailSetVisible] = React.useState(false);

    React.useEffect(() => {
        client.users
            .get(Number(id))
            .then((user) => {
                setName(user.name);
                setEmail(user.email);
                const groups = (user.groups as BlueboardUserGroup[]).map((el) => ({
                    value: el.id,
                    label: el.name,
                }));
                setGroups(groups);

                client.groups
                    .all()
                    .then((res) => {
                        const all = res.map((el) => ({ value: el.id, label: el.name }));
                        setAllGroups(all);
                        setLoading(false);
                    })
                    .catch((err) => toast.error(err.message));
            })
            .catch((err) => {
                if (err instanceof BlueboardNotFoundException) {
                    history.push("/404");
                } else {
                    toast.error(err.message);
                }
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const trySave = (): void => {
        const data = new BlueboardUser(
            id,
            name,
            email,
            groups.map((group) => (group.value as number) ?? group),
        );

        setSavePending(true);
        client.users
            .save(data)
            .then((res) => {
                toast.success("Sikeres mentés!");
                history.push("/admin/users");
            })
            .catch((err) => {
                setSavePending(false);
                if (err.errors) {
                    if (err.errors.name != null) {
                        setNameErr(err.errors.name);
                        nameSetVisible(true);
                    }
                    if (err.errors.email != null) {
                        setEmailErr(err.errors.email);
                        emailSetVisible(true);
                    }
                } else {
                    setGLOBERR(err.message);
                    globSetVisible(true);
                }
            });
    };

    return (
        <AuthLayout>
            <HeaderCard title={loading ? <Loading color="white" /> : `Felhasználó: ${name}`} />
            {loading ? (
                <Center>
                    <TableLoader />
                </Center>
            ) : (
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
                                <CardBody>
                                    <Container gap={0}>
                                        <Row>
                                            <Col lg="6">
                                                <Input
                                                    fullWidth={true}
                                                    className="mt-2"
                                                    clearable={true}
                                                    bordered={true}
                                                    underlined={true}
                                                    color={name === "" ? "error" : "primary"}
                                                    shadow={false}
                                                    onChange={(e) => setName(e.target.value)}
                                                    labelLeft="Név: "
                                                    initialValue={name}
                                                />
                                                <Alert
                                                    className="mt-2"
                                                    color="danger"
                                                    isOpen={nameIsVisible}
                                                    toggle={() => nameSetVisible(false)}>
                                                    {nameErr.map((el) => (
                                                        <span key={el}>
                                                            {" "}
                                                            {el} <br />{" "}
                                                        </span>
                                                    ))}
                                                </Alert>
                                            </Col>
                                            <Col lg="6">
                                                <Input
                                                    fullWidth={true}
                                                    className="mt-2"
                                                    clearable={true}
                                                    bordered={true}
                                                    underlined={true}
                                                    color={email === "" ? "error" : "primary"}
                                                    shadow={false}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    labelLeft="Email: "
                                                    initialValue={email}
                                                />
                                                <Alert
                                                    className="mt-2"
                                                    color="danger"
                                                    isOpen={emailIsVisible}
                                                    toggle={() => emailSetVisible(false)}>
                                                    {emailErr.map((el) => (
                                                        <span key={el}>
                                                            {" "}
                                                            {el} <br />{" "}
                                                        </span>
                                                    ))}
                                                </Alert>
                                            </Col>
                                        </Row>
                                        <Row className="align-items-center">
                                            <Col lg="1" md="2">
                                                <div className="align-text-middle">Csoportok:</div>
                                            </Col>
                                            <Col lg="11" md="10">
                                                <Select
                                                    components={animatedComponents}
                                                    closeMenuOnSelect={false}
                                                    defaultValue={groups}
                                                    isMulti={true}
                                                    theme={(dropTheme) => {
                                                        return {
                                                            ...dropTheme,
                                                            borderRadius: 4,
                                                            colors: {
                                                                ...dropTheme.colors,
                                                                primary: theme.palette.primary,
                                                                primary25: theme.palette.primary,
                                                                primary50: theme.palette.primary,
                                                                primary75: theme.palette.primary,
                                                                danger: theme.palette.errorDark,
                                                                dangerLight:
                                                                    theme.palette.secondary,
                                                                neutral0: theme.palette.accents_1,
                                                                neutral10: theme.palette.accents_2,
                                                                neutral20: theme.palette.accents_2,
                                                                neutral30: theme.palette.accents_3,
                                                                neutral40: theme.palette.accents_4,
                                                                neutral50: theme.palette.accents_5,
                                                                neutral60: theme.palette.accents_6,
                                                                neutral70: theme.palette.accents_7,
                                                                neutral80: theme.palette.accents_8,
                                                                neutral90: theme.palette.accents_8,
                                                            },
                                                        };
                                                    }}
                                                    options={allGroups}
                                                    className="mt-2"
                                                    onChange={(e: any) =>
                                                        setGroups(e.map((e: any) => e.value))
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                    </Container>

                                    <Alert
                                        color="danger"
                                        className="mt-2"
                                        isOpen={globIsVisible}
                                        toggle={() => globSetVisible(false)}>
                                        <h4 className="alert-heading">Hoppácska!</h4>
                                        <p>{GLOBERR}</p>
                                    </Alert>
                                    <Center>
                                        <Button
                                            auto={true}
                                            className="mt-2"
                                            loading={savePending}
                                            loaderType="points"
                                            color="gradient"
                                            rounded={true}
                                            onClick={trySave}>
                                            Mentés
                                        </Button>
                                    </Center>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            )}
        </AuthLayout>
    );
};

export default EditUser;
