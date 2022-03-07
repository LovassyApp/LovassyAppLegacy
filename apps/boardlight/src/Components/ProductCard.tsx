import { Badge, Col, Row } from 'reactstrap';
import { BlueboardInventoryItem, BlueboardProduct } from 'blueboard-client';
import { Button, Card, Text } from '@nextui-org/react';

import Middleware from '../Helpers/Middleware';

const ProductCard = ({
    product,
    callback,
    item,
}: {
    product: BlueboardProduct;
    callback(product: BlueboardProduct, item?: BlueboardInventoryItem): void;
    item?: BlueboardInventoryItem;
}): JSX.Element => {
    return (
        <Card width="100%" hoverable={true} color="#0f1114" cover={true}>
            <Card.Header
                style={{
                    position: 'absolute',
                    zIndex: 1,
                    top: 5,
                    border: 'none',
                }}>
                <Col>
                    <Text h4={true} weight="bold" color="white">
                        {product.name}
                    </Text>

                    <Text className="text-justify mt-2" p={true} color="white">
                        {product.description}
                    </Text>
                </Col>
            </Card.Header>
            <Card.Body>
                <Card.Image
                    autoResize={false}
                    src={product.imageUrl}
                    height={300}
                    alt="ez nemtom mi"
                />
            </Card.Body>
            <Card.Footer
                blur={true}
                border={true}
                noPadding={true}
                borderColor="rgba(15, 17, 20, 0.4)"
                style={{ position: 'absolute', zIndex: 1, bottom: 0 }}>
                {item === undefined ? (
                    <ProductFooter product={product} buttonCallback={callback} />
                ) : (
                    <ItemFooter item={item} buttonCallback={callback} />
                )}
            </Card.Footer>
        </Card>
    );
};

const ItemFooter = ({
    item,
    buttonCallback,
}: {
    item: BlueboardInventoryItem;
    buttonCallback(product: BlueboardProduct, item: BlueboardInventoryItem): void;
}): JSX.Element => {
    return (
        <Row className="m-0 px-2 py-2 w-100">
            <Col sm="2" xl="3" className="align-self-center">
                <Row className="align-self-center">
                    <Middleware
                        permission="Inventory.use"
                        displayError={false}
                        component={
                            <Button
                                flat={item.usedAt === null}
                                // disabled={item.usedAt !== null}
                                auto={true}
                                onClick={() => {
                                    buttonCallback(item.product, item);
                                }}
                                rounded={true}
                                color={item.usedAt !== null ? 'error' : '#94f9f0'}>
                                <Text size={12} weight="bold" transform="uppercase">
                                    {item.usedAt !== null ? 'Megtekintés' : 'Beváltás'}
                                </Text>
                            </Button>
                        }
                    />
                </Row>
            </Col>
            <Col className="float-end text-end align-self-center">
                {item.usedAt === null ? (
                    <>
                        {item.product.codeActivated ? (
                            <Badge pill={true} color="warning">
                                Csak QR kóddal aktiválható ({item.product.codeNames.join(', ')})
                            </Badge>
                        ) : (
                            <Badge pill={true} color="success">
                                Magában aktiválható
                            </Badge>
                        )}
                        <Row>
                            <Col>
                                {item.product.inputs.map((el, key) => (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <Badge key={key} pill={true} className="me-1" color="primary">
                                        {el.title}
                                        {` (${el.type === 'boolean' ? 'Igen / nem' : 'Szöveg'})`}
                                    </Badge>
                                ))}
                            </Col>
                        </Row>
                    </>
                ) : (
                    <div className="mt-1">
                        <Badge pill={true} color="danger">
                            Felhasználva ({item.usedAt})
                        </Badge>
                    </div>
                )}
            </Col>
        </Row>
    );
};

const ProductFooter = ({
    product,
    buttonCallback,
}: {
    product: BlueboardProduct;
    buttonCallback(product: BlueboardProduct): void;
}): JSX.Element => {
    return (
        <Row className="m-0 px-2 py-2 w-100">
            <Col>
                <Row>
                    <Middleware
                        permission="Store.buy"
                        displayError={false}
                        component={
                            <Button
                                flat={true}
                                disabled={!(product.quantity > 0)}
                                auto={true}
                                onClick={() => {
                                    buttonCallback(product);
                                }}
                                rounded={true}
                                color="#94f9f0">
                                <Text size={12} weight="bold" transform="uppercase">
                                    Megveszem
                                </Text>
                            </Button>
                        }
                    />
                </Row>
            </Col>
            <Col className="float-end text-end">
                {product.quantity > 0 ? (
                    product.quantity === 1 ? (
                        <Badge pill={true} color="warning">
                            Raktáron, {product.quantity} darab
                        </Badge>
                    ) : (
                        <Badge pill={true} color="success">
                            Raktáron, {product.quantity} darab
                        </Badge>
                    )
                ) : (
                    <Badge pill={true} color="danger">
                        Elfogyott
                    </Badge>
                )}
                <br />
                <Badge pill={true} color="success">
                    {product.price} LoLó
                </Badge>
            </Col>
        </Row>
    );
};

export default ProductCard;
