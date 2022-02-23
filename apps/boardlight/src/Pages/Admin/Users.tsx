import React from "react";
import AuthLayout from "../../Layouts/Auth";
import HeaderCard from "../../Components/HeaderCard";
import DataTable from "react-data-table-component";
import { Container, Col, Row, Card, CardBody, Badge } from "reactstrap";
import { Button, useTheme } from "@nextui-org/react";
import TableLoader from "../../Components/TableLoader";
import { useHistory } from "react-router";
import toast from "react-hot-toast";
import EmptyTable from "../../Components/EmptyTable";
import deleteModal from "../../Helpers/DeleteModal";
import { useBlueboardClient } from "blueboard-client-react";
import { BlueboardUser, BlueboardUserGroup } from "blueboard-client";
import { useUser } from "../../Hooks/ControlHooks";
import Middleware from "../../Helpers/Middleware";
const Users = (): JSX.Element => {
    const [users, setUsers] = React.useState<BlueboardUser[]>([]);
    const [loading, setLoading] = React.useState(true);
    const history = useHistory();
    const theme = useTheme();
    const client = useBlueboardClient();

    const user = useUser();

    const bootstrap = async (): Promise<void> => {
        setLoading(true);
        client.users
            .all()
            .then((res) => {
                setUsers(res);
                setLoading(false);
            })
            .catch((err) => toast.error(err.message));
    };

    React.useEffect(() => {
        bootstrap();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const deleteRow = async (row: BlueboardUser): Promise<void> => {
        const res = await deleteModal(
            "Biztos, hogy törölni szeretnéd ezt a felhasználót?",
            `Törlés - ${row.name}`,
            theme,
        );

        if (res.isConfirmed) {
            toast.promise(
                client.users.delete(row.id as number).then(() => bootstrap()),
                {
                    loading: "Törlés...",
                    success: "Sikeresen törölve!",
                    error: "Hiba történt!",
                },
            );
        }
    };

    const editEl = async (el: BlueboardUser): Promise<void> => {
        history.push(`/admin/users/edit/${el.id}`);
    };

    const columns = [
        {
            name: "ID",
            selector: (row: BlueboardUser) => row.id,
        },
        {
            name: "Név",
            selector: (row: BlueboardUser) => row.name,
        },
        {
            name: "E-mail cím",
            selector: (row: BlueboardUser) => row.email,
        },
        {
            name: "LoLó egyenleg",
            selector: (row: BlueboardUser) => row.balance ?? 0,
        },
        {
            name: "Csoportok",
            cell: (row: BlueboardUser) => (
                <div>
                    {row.groups.length === 0 ? (
                        <i>Itt nincs semmi.</i>
                    ) : (
                        row.groups.map((el) => (
                            <Badge
                                pill={true}
                                key={(el as BlueboardUserGroup).id}
                                className="badge-white m-1">
                                {(el as BlueboardUserGroup).name}
                            </Badge>
                        ))
                    )}
                </div>
            ),
            wrap: true,
        },
        {
            name: "",
            cell: (el: BlueboardUser) => {
                return (
                    <>
                        <Middleware
                            permission="Users.update"
                            displayError={false}
                            component={
                                <Button
                                    className="mx-1"
                                    auto={true}
                                    rounded={true}
                                    color="primary"
                                    onClick={() => editEl(el)}>
                                    Szerkesztés
                                </Button>
                            }
                        />

                        <Middleware
                            permission="Users.delete"
                            displayError={false}
                            component={
                                <Button
                                    className="mx-1"
                                    auto={true}
                                    rounded={true}
                                    color="error"
                                    disabled={user.id === el.id}
                                    onClick={() => deleteRow(el)}>
                                    Törlés
                                </Button>
                            }
                        />
                    </>
                );
            },
        },
    ];

    return (
        <AuthLayout>
            <HeaderCard title="Felhasználók" />
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
                                    data={users}
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

export default Users;
