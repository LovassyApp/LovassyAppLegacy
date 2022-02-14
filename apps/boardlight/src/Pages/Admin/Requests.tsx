import React from 'react';
import AuthLayout from '../../Layouts/Auth';
import HeaderCard from '../../Components/HeaderCard';
import DataTable from 'react-data-table-component';
import { Container, Col, Row, Card, CardBody, Badge, Modal } from 'reactstrap';
import { Button, useTheme } from '@nextui-org/react';
import TableLoader from '../../Components/TableLoader';
import toast from 'react-hot-toast';
import EmptyTable from '../../Components/EmptyTable';
import { useBlueboardClient } from 'blueboard-client-react';
import { BlueboardClient, BlueboardLoloRequest } from 'blueboard-client';
import { eventDeclaration } from '../../Hooks/EventHooks';

const RequestModalContent = ({
    client,
    callback,
    request,
}: {
    client: BlueboardClient;
    callback: () => void;
    request: eventDeclaration;
}) => {};

const Requests = () => {
    const [requests, setRequests] = React.useState<BlueboardLoloRequest[]>([]);
    const [loading, setLoading] = React.useState(true);
    const theme = useTheme();
    const client = useBlueboardClient();

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
        {
            name: '',
            cell: (row: BlueboardLoloRequest) => {
                if (row.acceptedAt !== null) {
                    return (
                        <Badge color="success" pill>
                            Elfogadva ({row.acceptedAt})
                        </Badge>
                    );
                }
                if (row.deniedAt !== null) {
                    return (
                        <Badge color="danger" pill>
                            Elutasítva ({row.deniedAt})
                        </Badge>
                    );
                }

                return (
                    <Button auto color="gradient">
                        Megtekintés
                    </Button>
                );
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
