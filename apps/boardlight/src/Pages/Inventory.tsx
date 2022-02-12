import * as React from 'react';
import HeaderCard from '../Components/HeaderCard';
import EmptyTable from '../Components/EmptyTable';
import AuthLayout from '../Layouts/Auth';
//import { useTheme } from '@nextui-org/react';
//import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useBlueboardClient, useBlueboardPrivateChannel } from 'blueboard-client-react';
import { useUser } from '../Hooks/ControlHooks';
import { BlueboardClient, BlueboardInventoryItem, BlueboardProduct } from 'blueboard-client';
import Center from '../Components/Center';
import TableLoader from '../Components/TableLoader';
import ProductCard from '../Components/ProductCard';
import { Row, Col, Container, Badge } from 'reactstrap';
import { Card, Input, Text, Modal, Button, Grid, useTheme } from '@nextui-org/react';
import { matchSorter } from 'match-sorter';
import { eventDeclaration, useStatefulEvent, useStatefulListener } from '../Hooks/EventHooks';
import MDEditor from '@uiw/react-md-editor';
import InputRenderer from '../Components/InputRenderer';
import QrReader from 'react-qr-reader';
import itemUsedModal from '../Helpers/ItemUsedModal';
import itemUsedModalFresh from '../Helpers/ItemUsedModalFresh';
const defaultItem = {} as BlueboardInventoryItem;
const defaultProduct = {} as BlueboardProduct;

const ItemModalContent = ({
    productEventDeclaration,
    itemEventDeclaration,
    closeHandler,
    callback,
    client,
}: {
    productEventDeclaration: eventDeclaration;
    itemEventDeclaration: eventDeclaration;
    closeHandler: any;
    callback: any;
    client: BlueboardClient;
}) => {
    const product: BlueboardProduct = useStatefulListener(productEventDeclaration);
    const item: BlueboardInventoryItem = useStatefulListener(itemEventDeclaration);

    const getInitialInputState = React.useCallback((): { [key: string]: string | boolean } => {
        let obj: { [key: string]: string | boolean } = {};

        const inputs = product.inputs ?? [];

        inputs.forEach((el) => {
            if (el.type === 'textbox') {
                obj[el.name] = '';
            }

            if (el.type === 'boolean') {
                obj[el.name] = false;
            }
        });

        return obj;
    }, [product]);

    const [inputState, setInputState] = React.useState<{ [key: string]: string | boolean }>(getInitialInputState());
    const [errors, setErrors] = React.useState<{ [key: string]: Array<string> }>({});
    const [canScan, setScan] = React.useState<boolean>(false);
    const [savePending, setSavePending] = React.useState<boolean>(false);
    const [codeValidated, setCodeValidated] = React.useState<boolean>(false);
    const [buttonLoading, setButtonLoading] = React.useState<boolean>(false);
    const [qrContent, setQRContent] = React.useState<string>('');
    const [codeName, setCodeName] = React.useState<string>('');

    const sendCallback = React.useCallback(
        (product: BlueboardProduct, item: BlueboardInventoryItem) => {
            setSavePending(true);
            setErrors({});
            client.inventory
                .useItem(item.id, qrContent, inputState)
                .then((res) => {
                    closeHandler();
                    callback(product, res);
                })
                .catch((err) => {
                    setSavePending(false);
                    if (err.errors != null) {
                        setErrors(err.errors);
                    } else {
                        toast.error(err.message);
                    }
                });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [qrContent, inputState]
    );

    const startScan = React.useCallback(() => {
        clearScan();
        setScan(true);
        setButtonLoading(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clearScan = React.useCallback(() => {
        setScan(false);
        setButtonLoading(false);
        setCodeValidated(false);
        setQRContent('');
        setCodeName('');
    }, []);

    const handleScan = React.useCallback((data) => {
        (async () => {
            if (data !== null) {
                clearScan();
                setButtonLoading(true);
                try {
                    const codeData = await client.inventory.verifyCode(data);
                    const foundItem: any = codeData.usableItems.find((x) => x.id === item.id);
                    if (foundItem === undefined) {
                        throw new Error();
                    }
                    setQRContent(data);
                    setCodeName(codeData.codeName);
                    setCodeValidated(true);
                    setButtonLoading(false);
                } catch (e) {
                    toast.error('A beolvasott kód nem használható a termék beváltására.');
                    clearScan();
                }
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleError = React.useCallback((error) => {
        toast.error(error.message);
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
                                    {
                                        <QrReader
                                            style={{ width: '320px' }}
                                            onError={handleError}
                                            onScan={handleScan}
                                            delay={100}
                                        ></QrReader>
                                    }
                                </Grid.Container>
                            </Col>
                        </Row>
                        <Row>
                            <Center>
                                <Button rounded auto flat onClick={clearScan} color="error">
                                    Mégsem
                                </Button>
                            </Center>
                        </Row>
                    </>
                ) : (
                    <></>
                )}
                {codeValidated ? (
                    <Row>
                        <Center>
                            <Badge pill color="success">
                                QR Kód: {codeName}
                            </Badge>
                        </Center>
                    </Row>
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
                    loading={savePending}
                    loaderType="points"
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
    const theme = useTheme();

    useBlueboardPrivateChannel('Users.' + user.id, 'TestEvent', (data: any) => {
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

    const openUse = React.useCallback(
        (product: BlueboardProduct, item?: BlueboardInventoryItem) => {
            if (item?.usedAt !== null) {
                itemUsedModal(item as BlueboardInventoryItem, theme);
            } else {
                setProduct(product);
                setItem(item);
                setVisible(true);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [theme]
    );

    const itemCallback = React.useCallback((product: BlueboardProduct, item: BlueboardInventoryItem) => {
        itemUsedModalFresh(item, theme);
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    client={client}
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
