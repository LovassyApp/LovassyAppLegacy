import * as React from 'react';
import HeaderCard from '../Components/HeaderCard';
import EmptyTable from '../Components/EmptyTable';
import AuthLayout from '../Layouts/Auth';
//import { useTheme } from '@nextui-org/react';
//import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useBlueboardClient, useBlueboardPrivateChannel } from 'blueboard-client-react';
import { useUser } from '../Hooks/ControlHooks';
import { BlueboardInventoryItem, BlueboardProduct } from 'blueboard-client';
import Center from '../Components/Center';
import TableLoader from '../Components/TableLoader';
import ProductCard from '../Components/ProductCard';
import { Row, Col, Container, Badge } from 'reactstrap';
import { Card, Input, Text, Modal, Button, Grid } from '@nextui-org/react';
import { matchSorter } from 'match-sorter';
import { eventDeclaration, useStatefulEvent, useStatefulListener } from '../Hooks/EventHooks';
import MDEditor from '@uiw/react-md-editor';
import InputRenderer from '../Components/InputRenderer';
import QrReader from 'react-qr-reader';

const defaultItem = {} as BlueboardInventoryItem;
const defaultProduct = {} as BlueboardProduct;

const ItemModalContent = ({
    productEventDeclaration,
    itemEventDeclaration,
    closeHandler,
    callback,
}: {
    productEventDeclaration: eventDeclaration;
    itemEventDeclaration: eventDeclaration;
    closeHandler: any;
    callback: any;
}) => {
    const product: BlueboardProduct = useStatefulListener(productEventDeclaration);
    const item: BlueboardInventoryItem = useStatefulListener(itemEventDeclaration);

    const getInitialInputState = React.useCallback((): { [key: string]: string } => {
        let obj: { [key: string]: string } = {};

        const inputs = product.inputs ?? [];

        inputs.forEach((el) => {
            obj[el.name] = '';
        });

        return obj;
    }, [product]);

    const [inputState, setInputState] = React.useState<{ [key: string]: string }>(getInitialInputState());
    const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
    const [canScan, setScan] = React.useState<boolean>(false);
    const [codeValidated, setCodeValidated] = React.useState<boolean>(false);
    const [buttonLoading, setButtonLoading] = React.useState<boolean>(false);
    const [qrContent, setQRContent] = React.useState<string>('');

    const sendCallback = React.useCallback((product: BlueboardProduct, item: BlueboardInventoryItem) => {
        console.log(product, item);
        callback(product, item);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const startScan = React.useCallback(() => {
        setScan(true);
        setQRContent('');
        setButtonLoading(true);
    }, []);

    const endScan = React.useCallback(() => {
        setScan(false);
        setButtonLoading(false);
    }, []);

    const handleScan = React.useCallback((data) => {
        console.log(data);
        if (data !== null) {
            toast.success('Kód beolvasva! Ellenőrzés...');
            setQRContent(data);
            endScan();
            setButtonLoading(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleError = React.useCallback((error) => {
        console.log(error);
    }, []);

    return (
        <>
            <Modal.Header style={{ border: 'none' }}>
                <Text id="modal-title" size={18}>
                    Termékbeváltás - {product.name}
                </Text>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col xs="4" md="2">
                        Leírás:
                    </Col>
                    <Col>
                        <MDEditor.Markdown source={product.markdownContent} />
                    </Col>
                </Row>

                {product.inputs?.length > 0 ?? false ? (
                    <Row>
                        <InputRenderer
                            inputs={product.inputs}
                            callback={(input: string, value: string | boolean) => {
                                const newState = { ...inputState };
                                newState[input] = value as string;
                                setInputState(newState);
                            }}
                            errors={errors}
                            inputState={inputState}
                        />
                    </Row>
                ) : null}
                {product.codeActivated ? (
                    <Row>
                        <Center>
                            <Button
                                rounded
                                onClick={startScan}
                                loading={buttonLoading}
                                loaderType="points"
                                disabled={canScan || buttonLoading}
                                color="gradient"
                                auto
                            >
                                Kód beolvasása
                            </Button>
                        </Center>
                    </Row>
                ) : (
                    <></>
                )}
                {canScan ? (
                    <>
                        <Row>
                            <Col>
                                <Grid.Container justify="center" className="my-2" gap={2}>
                                    <QrReader
                                        style={{ width: '320px' }}
                                        onError={handleError}
                                        onScan={handleScan}
                                        delay={100}
                                    ></QrReader>
                                </Grid.Container>
                            </Col>
                        </Row>
                        <Row>
                            <Center>
                                <Button rounded auto flat onClick={endScan} color="error">
                                    Mégsem
                                </Button>
                            </Center>
                        </Row>
                    </>
                ) : (
                    <></>
                )}
            </Modal.Body>
            <Modal.Footer style={{ overflow: 'visible', border: 'none' }}>
                <Button auto rounded flat color="error" onClick={closeHandler}>
                    Mégsem
                </Button>
                <Button
                    auto
                    rounded
                    color="success"
                    disabled={product.codeActivated && codeValidated === false}
                    onClick={() => {
                        sendCallback(product, item);
                    }}
                >
                    Beváltás
                </Button>
            </Modal.Footer>
        </>
    );
};

const Inventory = () => {
    const user = useUser();
    const client = useBlueboardClient();

    useBlueboardPrivateChannel('App.Models.User.' + user.id, 'TestEvent', (data: any) => {
        toast(data.message);
    });

    const [items, setItems] = React.useState<BlueboardInventoryItem[]>([] as BlueboardInventoryItem[]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [query, setQuery] = React.useState<string>('');
    const [visible, setVisible] = React.useState<boolean>(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [productRef, setProduct, productEventDeclaration] = useStatefulEvent(0, 'inventoryProductEvent');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [itemRef, setItem, itemEventDeclaration] = useStatefulEvent(0, 'inventoryItemEvent');

    const bootstrap = React.useCallback(() => {
        setLoading(true);
        client.inventory
            .items()
            .then((res) => {
                setItems(res);
                setLoading(false);
            })
            .catch((err) => toast.error(err.message));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(bootstrap, []);

    const renderedItems =
        query === '' ? items : matchSorter(items, query, { keys: ['product.name', 'product.description'] });

    const openUse = React.useCallback((product: BlueboardProduct, item?: BlueboardInventoryItem) => {
        setProduct(product);
        setItem(item);
        setVisible(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const itemCallback = React.useCallback((product: BlueboardProduct, item: BlueboardInventoryItem) => {
        console.log(product, item);
    }, []);

    const closeHandler = React.useCallback(() => {
        setVisible(false);
        setTimeout(() => {
            setProduct(defaultProduct);
            setItem(defaultItem);
        }, 200);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AuthLayout>
            <Modal
                closeButton
                blur
                aria-labelledby="modal-title"
                open={visible}
                onClose={closeHandler}
                preventClose
                width="650px"
            >
                <ItemModalContent
                    itemEventDeclaration={itemEventDeclaration}
                    productEventDeclaration={productEventDeclaration}
                    closeHandler={closeHandler}
                    callback={itemCallback}
                />
            </Modal>
            <HeaderCard title="Kincstár" />
            {loading ? (
                <Center>
                    <TableLoader />
                </Center>
            ) : (
                <>
                    <Container fluid style={{ width: '95%' }}>
                        <Card hoverable>
                            <Row>
                                <Col md="4" sm="12">
                                    <Text className="mt-1">
                                        <Badge pill className="badge-primary">
                                            {renderedItems.length} / {items.length} tárgy
                                        </Badge>
                                    </Text>
                                </Col>
                                <Col md="4" sm="0"></Col>
                                <Col md="4" sm="12">
                                    <Input
                                        fullWidth
                                        clearable
                                        bordered
                                        underlined
                                        shadow={false}
                                        onChange={(e) => setQuery(e.target.value)}
                                        labelLeft="Filter"
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Container>
                    {renderedItems.length === 0 ? (
                        <Center>
                            <div className="mt-4">
                                <EmptyTable />
                            </div>
                        </Center>
                    ) : (
                        <>
                            <Container fluid style={{ width: '95%' }}>
                                <Row className="mt-4">
                                    {renderedItems.map((item) => (
                                        <Col key={item.id} className="mt-2 mb-3" xl="3" md="6">
                                            <ProductCard
                                                product={item.product}
                                                item={item}
                                                callback={openUse}
                                            ></ProductCard>
                                        </Col>
                                    ))}
                                </Row>
                            </Container>
                        </>
                    )}
                </>
            )}
        </AuthLayout>
    );
};

export default Inventory;
