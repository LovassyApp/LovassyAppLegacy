import React from "react";
import AuthLayout from "../../Layouts/Auth";
import HeaderCard from "../../Components/HeaderCard";
import DataTable from "react-data-table-component";
import { Container, Col, Row, Card, CardBody, Badge } from "reactstrap";
import { Button, useTheme } from "@nextui-org/react";
import TableLoader from "../../Components/TableLoader";
import { MdAdd } from "react-icons/md";
import { useHistory } from "react-router";
import toast from "react-hot-toast";
import EmptyTable from "../../Components/EmptyTable";
import Middleware from "../../Helpers/Middleware";
import deleteModal from "../../Helpers/DeleteModal";
import { useBlueboardClient } from "blueboard-client-react";
import { BlueboardUserGroup } from "blueboard-client";
import Center from "../../Components/Center";

const Groups = (): JSX.Element => {
    const [groups, setGroups] = React.useState<BlueboardUserGroup[]>([]);
    const [loading, setLoading] = React.useState(true);
    const history = useHistory();
    const theme = useTheme();
    const client = useBlueboardClient();

    const bootstrap = async (): Promise<void> => {
        setLoading(true);
        client.groups
            .all()
            .then((res) => {
                setGroups(res);
                setLoading(false);
            })
            .catch((err) => toast.error(err.message));
    };

    React.useEffect(() => {
        bootstrap();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const deleteRow = async (row: BlueboardUserGroup): Promise<void> => {
        const res = await deleteModal(
            "Biztos, hogy törölni szeretnéd ezt a csoportot?",
            `Törlés - ${row.name}`,
            theme,
        );

        if (res.isConfirmed) {
            toast.promise(
                client.groups.delete(row.id as number).then(() => bootstrap()),
                {
                    loading: "Törlés...",
                    success: "Sikeresen törölve!",
                    error: "Hiba történt!",
                },
            );
        }
    };

    const columns = [
        {
            name: "ID",
            selector: (row: BlueboardUserGroup) => row.id,
        },
        {
            name: "Csoportnév",
            selector: (row: BlueboardUserGroup) => row.name,
        },
        {
            name: "Jogok",
            cell: (row: BlueboardUserGroup) => (
                <div>
                    {row.permissions.map((el, key) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <Badge pill={true} key={key} className="badge-white m-1">
                            {el}
                        </Badge>
                    ))}
                </div>
            ),
            grow: 3,
            wrap: true,
        },
        {
            name: "",
            cell: (el: BlueboardUserGroup) => {
                return (
                    <>
                        <Middleware
                            permission="Permissions.update"
                            component={
                                <>
                                    <Button
                                        className="mx-1"
                                        auto={true}
                                        rounded={true}
                                        color="primary"
                                        onClick={() =>
                                            history.push(`/admin/permissions/edit/${el.id}`)
                                        }>
                                        Szerkesztés
                                    </Button>
                                </>
                            }
                        />

                        <Middleware
                            permission="Permissions.delete"
                            component={
                                <>
                                    <Button
                                        className="mx-1"
                                        auto={true}
                                        rounded={true}
                                        color="error"
                                        onClick={() => deleteRow(el)}>
                                        Törlés
                                    </Button>
                                </>
                            }
                        />
                    </>
                );
            },
        },
    ];

    return (
        <AuthLayout>
            <HeaderCard title="Felhasználói csoportok" />
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
                            <CardBody style={{ height: "calc(100vh - 320px)" }}>
                                <DataTable
                                    highlightOnHover={true}
                                    pointerOnHover={true}
                                    columns={columns}
                                    data={groups}
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
                    <div className="mt-2" />
                    <Center>
                        <Middleware
                            permission="Permissions.add"
                            component={
                                <>
                                    <Button
                                        color="gradient"
                                        rounded={true}
                                        onClick={() => history.push("/admin/permissions/edit/new")}>
                                        <MdAdd />
                                        Csoport hozzáadása
                                    </Button>
                                </>
                            }
                        />
                    </Center>
                </Row>
            </Container>
        </AuthLayout>
    );
};

export default Groups;
