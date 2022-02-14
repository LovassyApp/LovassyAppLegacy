import React from 'react';
import AuthLayout from '../../Layouts/Auth';
import HeaderCard from '../../Components/HeaderCard';
import DataTable from 'react-data-table-component';
import { Container, Col, Row, Card, CardBody, Badge } from 'reactstrap';
import { Button, useTheme } from '@nextui-org/react';
import TableLoader from '../../Components/TableLoader';
import { useHistory } from 'react-router';
import toast from 'react-hot-toast';
import EmptyTable from '../../Components/EmptyTable';
import deleteModal from '../../Helpers/DeleteModal';
import { useBlueboardClient } from 'blueboard-client-react';
import { BlueboardLoloRequest, BlueboardUser, BlueboardUserGroup } from 'blueboard-client';
import { useUser } from '../../Hooks/ControlHooks';
const Requests = () => {
    const [requests, setRequests] = React.useState<BlueboardLoloRequest[]>([]);
    const [loading, setLoading] = React.useState(true);
    const history = useHistory();
    const theme = useTheme();
    const client = useBlueboardClient();

    const user = useUser();

    const bootstrap = async () => {
        setLoading(true);
        client.lolo_request
            .all()
            .then((res) => {
                setRequests(res);
                setLoading(false);
            })
            .catch((err) => toast.error(err.message));
    };

    React.useEffect(() => {
        bootstrap();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const deleteRow = async (row: BlueboardUser) => {
        const res = await deleteModal(
            'Biztos, hogy törölni szeretnéd ezt a felhasználót?',
            'Törlés - ' + row.name,
            theme
        );

        if (res.isConfirmed) {
            toast.promise(
                client.users.delete(row.id as number).then(() => bootstrap()),
                {
                    loading: 'Törlés...',
                    success: 'Sikeresen törölve!',
                    error: 'Hiba történt!',
                }
            );
        }
    };

    const editEl = async (el: BlueboardLoloRequest) => {
        console.log(el);
    };

    const columns = [
        {
            name: 'ID',
            selector: (row: BlueboardLoloRequest) => row.id,
        },
        {
            name: 'Cím',
            selector: (row: BlueboardLoloRequest) => row.title,
        },
        {
            name: 'Diák neve',
            selector: (row: BlueboardLoloRequest) => row.user?.name ?? '',
        },
        {
            name: 'Benyújtás ideje',
            cell: (row: BlueboardLoloRequest) => {
                const unix = Date.parse(row.timestamps.createdAt);
                const date = new Date(unix);
                return date.toLocaleString();
            },
        },
    ];

    return (
        <AuthLayout>
            <HeaderCard title="LoLó kérvények" />
            <Container fluid style={{ width: '95%' }}>
                <Row className="ml-2 mr-2">
                    <Col md="12">
                        <Card
                            style={{
                                background: theme.type === 'dark' ? theme.palette.accents_1 : theme.palette.background,
                            }}
                        >
                            <CardBody
                                style={{
                                    height: 'calc(100vh - 320px)',
                                }}
                            >
                                <DataTable
                                    highlightOnHover
                                    pointerOnHover
                                    columns={columns}
                                    data={requests}
                                    theme={theme.type}
                                    progressPending={loading}
                                    progressComponent={<TableLoader />}
                                    noDataComponent={<EmptyTable />}
                                    fixedHeader
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
