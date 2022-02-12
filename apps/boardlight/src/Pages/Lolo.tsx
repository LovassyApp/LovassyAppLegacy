import * as React from 'react';
import HeaderCard from '../Components/HeaderCard';
import EmptyTable from '../Components/EmptyTable';
import AuthLayout from '../Layouts/Auth';
import { Text, Card, Button, Grid } from '@nextui-org/react';
//import toast from 'react-hot-toast';
import { useBlueboardClient } from 'blueboard-client-react';
import TableLoader from '../Components/TableLoader';
import { Col, Container, Row, Badge } from 'reactstrap';
import Center from '../Components/Center';
import toast from 'react-hot-toast';
import { BlueboardLoloData } from 'blueboard-client';
const Lolo = (): JSX.Element => {
    const client = useBlueboardClient();
    const [loading, setLoading] = React.useState(true);
    const [lolo, setLolo] = React.useState<BlueboardLoloData>({} as BlueboardLoloData);

    const bootstrap = React.useCallback(() => {
        setLoading(true);
        client.lolo
            .get(true)
            .then((res) => {
                //console.log(res);
                //console.log('fetch');
                setLolo(res);
                setLoading(false);
            })
            .catch((err) => {
                toast.error('ERROR! - ' + err.message);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(bootstrap, [bootstrap]);

    return (
        <AuthLayout>
            <HeaderCard title="LoLó, avagy Lovassy Lóvé" />
            {loading ? (
                <Center>
                    <TableLoader />
                </Center>
            ) : (
                <>
                    {lolo.coins.length === 0 ? (
                        <Center>
                            <div className="mt-4">
                                <EmptyTable />
                            </div>
                        </Center>
                    ) : (
                        <>
                            <Container fluid style={{ width: '95%' }}>
                                <Card hoverable>
                                    <Row>
                                        <Col md="4" sm="12">
                                            <Text className="mt-2">
                                                Jelenlegi egyenleged:{' '}
                                                <Badge
                                                    pill
                                                    color={
                                                        (lolo.balance ?? 0) > 0
                                                            ? (lolo.balance ?? 0) > 2
                                                                ? 'success'
                                                                : 'warning'
                                                            : 'danger'
                                                    }
                                                >
                                                    {lolo.balance} LoLó
                                                </Badge>
                                            </Text>
                                        </Col>
                                        <Col md="4" sm="0"></Col>
                                        <Col md="4" sm="12">
                                            <Button
                                                rounded
                                                onClick={bootstrap}
                                                auto
                                                className="float-md-end mt-md-0 mt-2"
                                                color="gradient"
                                            >
                                                Frissítés
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card>
                            </Container>
                            <Container fluid style={{ width: '95%' }}>
                                <Grid.Container justify="center" className="my-2" gap={2}>
                                    {lolo.coins.map((coin) => (
                                        <>
                                            <Grid>
                                                <Card hoverable>
                                                    <Text className="pb-1" h5>
                                                        {' '}
                                                        {coin.reasonText}{' '}
                                                        <Badge pill color={coin.isSpent ? 'danger' : 'success'}>
                                                            {coin.isSpent ? 'Felhasználva' : 'Aktív'}
                                                        </Badge>
                                                    </Text>
                                                    {coin.grades.map((grade) => (
                                                        <Badge
                                                            style={{ whiteSpace: 'normal' }}
                                                            className="badge-white my-1"
                                                        >
                                                            {grade.name} ({grade.type}) - {grade.teacher}
                                                        </Badge>
                                                    ))}
                                                    <Card.Footer></Card.Footer>
                                                </Card>
                                            </Grid>
                                        </>
                                    ))}
                                </Grid.Container>
                            </Container>
                        </>
                    )}
                </>
            )}
        </AuthLayout>
    );
};

export default Lolo;
