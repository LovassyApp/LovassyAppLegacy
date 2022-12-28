import * as React from 'react';
import HeaderCard from '../Components/HeaderCard';
import EmptyTable from '../Components/EmptyTable';
import AuthLayout from '../Layouts/Auth';
import { Text, Card, Button, Grid, Modal, Input, Textarea } from '@nextui-org/react';
// import toast from 'react-hot-toast';
import { useBlueboardClient } from 'blueboard-client-react';
import TableLoader from '../Components/TableLoader';
import { Col, Container, Row, Badge } from 'reactstrap';
import Center from '../Components/Center';
import toast from 'react-hot-toast';
import { BlueboardClient, BlueboardLoloData, BlueboardLoloReason } from 'blueboard-client';
import Middlware from '../Helpers/Middleware';

const RequestModalContent = ({
    closeHandler,
    client,
}: {
    closeHandler(): void;
    client: BlueboardClient;
}): JSX.Element => {
    const [body, setBody] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [savePending, setSavePending] = React.useState(false);
    const [errors, setErrors] = React.useState<{ [key: string]: string[] }>({});

    const getErrors = (inputName: string): string => {
        const err = errors ?? ({} as { [key: string]: string[] });

        const error = err[inputName] ?? [];
        let str = '';
        error.forEach((el: string) => {
            str = `${str + el}\n`;
        });

        return str;
    };

    const submit = React.useCallback(() => {
        setSavePending(true);
        client.lolo_request
            .make(title, body)
            .then(() => {
                closeHandler();
                toast.success('Kérvény sikeresen benyújtva!');
            })
            .catch((err) => {
                setSavePending(false);
                if (err.errors !== undefined) {
                    setErrors(err.errors);
                } else {
                    setErrors({ general: [err.message] });
                    toast.error(err.message);
                }
            });
    }, [body, title, client, closeHandler]);

    return (
        <>
            <Modal.Header style={{ border: 'none' }}>
                <Text id="modal-title" size={18}>
                    LoLó kérvény benyújtása
                </Text>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col className="mb-3">
                        <Input
                            fullWidth={true}
                            bordered={true}
                            underlined={true}
                            min="1"
                            className="mb-1"
                            shadow={false}
                            disabled={savePending}
                            onChange={(e) => setTitle(e.target.value)}
                            labelLeft="Cím: "
                            initialValue={title}
                            color={getErrors('title') === '' ? 'primary' : 'error'}
                            status={getErrors('title') === '' ? 'default' : 'error'}
                            helperColor={getErrors('title') === '' ? 'default' : 'error'}
                            helperText={getErrors('title')}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col className="mb-3">
                        <Textarea
                            bordered={true}
                            className="mb-1"
                            width="100%"
                            rows={6}
                            shadow={false}
                            disabled={savePending}
                            placeholder="Kérvény törzsszövege"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            color={getErrors('body') === '' ? 'primary' : 'error'}
                            status={getErrors('body') === '' ? 'default' : 'error'}
                            helperColor={getErrors('body') === '' ? 'default' : 'error'}
                            helperText={getErrors('body')}
                        />
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer style={{ overflow: 'visible', border: 'none' }}>
                <Button auto={true} rounded={true} flat={true} color="error" onClick={closeHandler}>
                    Mégsem
                </Button>
                <Button
                    auto={true}
                    rounded={true}
                    color="success"
                    flat={true}
                    loading={savePending}
                    onClick={submit}
                    loaderType="points">
                    Beküldés
                </Button>
            </Modal.Footer>
        </>
    );
};

const Lolo = (): JSX.Element => {
    const client = useBlueboardClient();
    const [loading, setLoading] = React.useState(true);
    const [lolo, setLolo] = React.useState<BlueboardLoloData>({} as BlueboardLoloData);

    const [show, setShow] = React.useState(false);

    const bootstrap = React.useCallback(() => {
        setLoading(true);
        client.lolo
            .get(true)
            .then((res) => {
                // console.log(res);
                // console.log('fetch');
                setLolo(res);
                setLoading(false);
            })
            .catch((err) => {
                toast.error(`ERROR! - ${err.message}`);
            });
    }, [client]);

    const closeHandler = React.useCallback(() => {
        setShow(false);
    }, []);

    React.useEffect(bootstrap, [bootstrap]);

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
                <RequestModalContent client={client} closeHandler={closeHandler} />
            </Modal>
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
                            <Container fluid={true} style={{ width: '95%' }}>
                                <Card hoverable={true}>
                                    <Row>
                                        <Col md="4" sm="12">
                                            <Text className="mt-2">
                                                Jelenlegi egyenleged:{' '}
                                                <Badge
                                                    pill={true}
                                                    color={
                                                        (lolo.balance ?? 0) > 0
                                                            ? (lolo.balance ?? 0) > 2
                                                                ? 'success'
                                                                : 'warning'
                                                            : 'danger'
                                                    }>
                                                    {lolo.balance} LoLó
                                                </Badge>
                                            </Text>
                                        </Col>
                                        <Col md="4" sm="0" />
                                        <Col md="4" sm="12">
                                            <Button
                                                rounded={true}
                                                onClick={bootstrap}
                                                auto={true}
                                                className="float-md-end mt-md-0 mt-2"
                                                color="gradient">
                                                Frissítés
                                            </Button>
                                            <Middlware
                                                permission="Requests::CreateRequest"
                                                component={
                                                    <Button
                                                        rounded={true}
                                                        onClick={() => setShow(true)}
                                                        auto={true}
                                                        className="float-md-end mt-md-0 me-2 mt-2"
                                                        color="success"
                                                        flat={true}>
                                                        Új kérvény
                                                    </Button>
                                                }
                                                displayError={false}
                                            />
                                        </Col>
                                    </Row>
                                </Card>
                            </Container>
                            <Container fluid={true} style={{ width: '95%' }}>
                                <Grid.Container justify="center" className="my-2" gap={2}>
                                    {lolo.coins.map((coin) => (
                                        <React.Fragment key={coin.id}>
                                            <Grid>
                                                <Card hoverable={true}>
                                                    <Text className="pb-1" h5={true}>
                                                        {' '}
                                                        {coin.reasonText}{' '}
                                                        <Badge
                                                            pill={true}
                                                            color={
                                                                coin.isSpent ? 'danger' : 'success'
                                                            }>
                                                            {coin.isSpent
                                                                ? 'Felhasználva'
                                                                : 'Aktív'}
                                                        </Badge>
                                                    </Text>
                                                    {coin.grades.map((grade) => (
                                                        <Badge
                                                            style={{ whiteSpace: 'normal' }}
                                                            className="badge-white my-1"
                                                            key={grade.id}>
                                                            {grade.name} ({grade.type}) -{' '}
                                                            {grade.teacher}
                                                        </Badge>
                                                    ))}
                                                    {coin.reason ===
                                                    BlueboardLoloReason.FromRequest ? (
                                                        <p> {coin.reasonBody} </p>
                                                    ) : (
                                                        <></>
                                                    )}
                                                    <Card.Footer />
                                                </Card>
                                            </Grid>
                                        </React.Fragment>
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
