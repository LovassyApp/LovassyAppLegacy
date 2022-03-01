import * as React from 'react';

import { Badge, Col, Container, Row } from 'reactstrap';
import {
    BlueboardClient,
    BlueboardInventoryFactory,
    BlueboardInventoryItem,
    BlueboardProduct,
} from 'blueboard-client';
import { Button, Card, Grid, Input, Modal, Text, useTheme } from '@nextui-org/react';
import { eventDeclaration, useStatefulEvent, useStatefulListener } from '../Hooks/EventHooks';
import { useBlueboardClient, useBlueboardPrivateChannel } from 'blueboard-client-react';

import AuthLayout from '../Layouts/Auth';
import Center from '../Components/Center';
import EmptyTable from '../Components/EmptyTable';
import HeaderCard from '../Components/HeaderCard';
import InputRenderer from '../Components/InputRenderer';
import MDEditor from '@uiw/react-md-editor';
import ProductCard from '../Components/ProductCard';
import QrReader from 'react-qr-reader';
import TableLoader from '../Components/TableLoader';
import itemUsedModal from '../Helpers/ItemUsedModal';
import itemUsedModalFresh from '../Helpers/ItemUsedModalFresh';
import { matchSorter } from 'match-sorter';
// import { useTheme } from '@nextui-org/react';
// import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useUser } from '../Hooks/ControlHooks';

const defaultItem = {} as BlueboardInventoryItem;
const defaultProduct = {} as BlueboardProduct;

const ItemModalContent = ({
    productEventDeclaration,
    itemEventDeclaration,
    closeHandler,
    callback,
    client,
}: {
    productEventDeclaration: eventDeclaration<BlueboardProduct>;
    itemEventDeclaration: eventDeclaration<BlueboardInventoryItem>;
    closeHandler: any;
    callback: any;
    client: BlueboardClient;
}): JSX.Element => {
    const product: BlueboardProduct = useStatefulListener(productEventDeclaration);
    const item: BlueboardInventoryItem = useStatefulListener(itemEventDeclaration);

    const getInitialInputState = React.useCallback((): { [key: string]: string | boolean } => {
        const obj: { [key: string]: string | boolean } = {};

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

    const [inputState, setInputState] = React.useState<{ [key: string]: string | boolean }>(
        getInitialInputState(),
    );
    const [errors, setErrors] = React.useState<{ [key: string]: string[] }>({});
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
                    if (err.errors !== undefined) {
                        setErrors(err.errors);
                    } else {
                        toast.error(err.message);
                    }
                });
        },
        [qrContent, inputState, client, callback, closeHandler],
    );

    const clearScan = React.useCallback(() => {
        setScan(false);
        setButtonLoading(false);
        setCodeValidated(false);
        setQRContent('');
        setCodeName('');
    }, []);

    const startScan = React.useCallback(() => {
        clearScan();
        setScan(true);
        setButtonLoading(true);
    }, [clearScan]);

    const handleScan = React.useCallback(
        (data) => {
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
        },
        [client, item, clearScan],
    );

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
                                rounded={true}
                                onClick={startScan}
                                loading={buttonLoading}
                                loaderType="points"
                                disabled={canScan || buttonLoading}
                                color="gradient"
                                auto={true}>
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
                                        />
                                    }
                                </Grid.Container>
                            </Col>
                        </Row>
                        <Row>
                            <Center>
                                <Button
                                    rounded={true}
                                    auto={true}
                                    flat={true}
                                    onClick={clearScan}
                                    color="error">
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
                            <Badge pill={true} color="success">
                                QR Kód: {codeName}
                            </Badge>
                        </Center>
                    </Row>
                ) : (
                    <></>
                )}
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
                    disabled={product.codeActivated && codeValidated === false}
                    onClick={() => {
                        sendCallback(product, item);
                    }}
                    loading={savePending}
                    loaderType="points">
                    Beváltás
                </Button>
            </Modal.Footer>
        </>
    );
};

const Inventory = (): JSX.Element => {
    const user = useUser();
    const client = useBlueboardClient();
    const theme = useTheme();

    useBlueboardPrivateChannel(`Users.${user.id}`, 'TestEvent', (data: any) => {
        toast(data.message);
    });

    const [items, setItems] = React.useState<BlueboardInventoryItem[]>(
        [] as BlueboardInventoryItem[],
    );
    const itemsRef = React.useRef<BlueboardInventoryItem[]>([] as BlueboardInventoryItem[]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [query, setQuery] = React.useState<string>('');
    const [visible, setVisible] = React.useState<boolean>(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [productRef, setProduct, productEventDeclaration] = useStatefulEvent<BlueboardProduct>(
        {} as BlueboardProduct,
        'inventoryProductEvent',
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [itemRef, setItem, itemEventDeclaration] = useStatefulEvent<BlueboardInventoryItem>(
        {} as BlueboardInventoryItem,
        'inventoryItemEvent',
    );

    const bootstrap = React.useCallback(() => {
        setLoading(true);
        client.inventory
            .items()
            .then((res) => {
                setItems(res);
                itemsRef.current = res;
                setLoading(false);
            })
            .catch((err) => toast.error(err.message));
    }, [client]);

    const itemChange = React.useCallback(
        (data: any) => {
            const newItem = BlueboardInventoryFactory.getItem(data.item);

            const itemsClone = [...itemsRef.current];

            const index = itemsClone.findIndex((x) => x.id === data.item.id);

            console.log(index === -1);

            if (index === -1) {
                itemsClone.push(newItem);
            } else {
                itemsClone[index] = newItem;
            }

            itemsRef.current = itemsClone;

            setItems(itemsRef.current);
        },
        [itemsRef],
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(bootstrap, []);

    useBlueboardPrivateChannel(`Users.${user.id}`, 'InventoryItemUsed', itemChange);
    useBlueboardPrivateChannel(`Users.${user.id}`, 'InventoryItemCreated', itemChange);

    const renderedItems =
        query === ''
            ? items
            : matchSorter(items, query, { keys: ['product.name', 'product.description'] });

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
        [theme, setItem, setProduct],
    );

    const itemCallback = React.useCallback(
        (product: BlueboardProduct, item: BlueboardInventoryItem) => {
            itemUsedModalFresh(item, theme);
        },
        [theme],
    );

    const closeHandler = React.useCallback(() => {
        setVisible(false);
        setTimeout(() => {
            setProduct(defaultProduct);
            setItem(defaultItem);
        }, 200);
    }, [setItem, setProduct]);

    return (
        <AuthLayout>
            <Modal
                closeButton={true}
                blur={true}
                aria-labelledby="modal-title"
                open={visible}
                onClose={closeHandler}
                preventClose={true}
                width="650px">
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
                    <Container fluid={true} style={{ width: '95%' }}>
                        <Card hoverable={true}>
                            <Row>
                                <Col md="4" sm="12">
                                    <Text className="mt-1">
                                        <Badge pill={true} className="badge-primary">
                                            {renderedItems.length} / {items.length} tárgy
                                        </Badge>
                                    </Text>
                                </Col>
                                <Col md="4" sm="0" />
                                <Col md="4" sm="12">
                                    <Input
                                        fullWidth={true}
                                        clearable={true}
                                        bordered={true}
                                        underlined={true}
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
                            <Container fluid={true} style={{ width: '95%' }}>
                                <Row className="mt-4">
                                    {renderedItems.map((item) => (
                                        <Col key={item.id} className="mt-2 mb-3" xl="3" md="6">
                                            <ProductCard
                                                product={item.product}
                                                item={item}
                                                callback={openUse}
                                            />
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
