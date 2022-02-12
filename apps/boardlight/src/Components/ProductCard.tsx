import { Row, Col, Badge } from 'reactstrap';
import { Card, Text, Button } from '@nextui-org/react';
import { BlueboardInventoryItem, BlueboardProduct } from 'blueboard-client';

const ProductCard = ({
    product,
    callback,
    item,
}: {
    product: BlueboardProduct;
    callback: (product: BlueboardProduct, item?: BlueboardInventoryItem) => void;
    item?: BlueboardInventoryItem;
}): JSX.Element => {
    return (
        <Card width="100%" hoverable color="#0f1114" cover>
            <Card.Header
                style={{
                    position: 'absolute',
                    zIndex: 1,
                    top: 5,
                    border: 'none',
                }}
            >
                <Col>
                    <Text h4 weight="bold" color="white">
                        {product.name}
                    </Text>

                    <Text className="text-justify mt-2" p color="white">
                        {product.description}
                    </Text>
                </Col>
            </Card.Header>
            <Card.Body>
                <Card.Image autoResize={false} src={product.imageUrl} height={300} alt="ez nemtom mi" />
            </Card.Body>
            <Card.Footer
                blur
                border
                noPadding
                borderColor="rgba(15, 17, 20, 0.4)"
                style={{ position: 'absolute', zIndex: 1, bottom: 0 }}
            >
                {item == null ? (
                    <ProductFooter product={product} buttonCallback={callback} />
                ) : (
                    <ItemFooter item={item} buttonCallback={callback}></ItemFooter>
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
    buttonCallback: (product: BlueboardProduct, item: BlueboardInventoryItem) => void;
}) => {
    return (
        <Row className="m-0 px-2 py-2 w-100">
            <Col sm="2">
                <Row>
                    <Button
                        flat
                        disabled={item.usedAt !== null}
                        auto
                        onClick={() => {
                            buttonCallback(item.product, item);
                        }}
                        rounded
                        color="#94f9f0"
                    >
                        <Text size={12} weight="bold" transform="uppercase">
                            Beváltás
                        </Text>
                    </Button>
                </Row>
            </Col>
            <Col className="float-end text-end">
                {item.usedAt !== '' ? (
                    <>
                        {item.product.codeActivated ? (
                            <Badge pill color="warning">
                                Csak QR kóddal aktiválható ({item.product.codeNames.join(', ')})
                            </Badge>
                        ) : (
                            <Badge pill color="success">
                                Magában aktiválható
                            </Badge>
                        )}
                        <Row>
                            <Col>
                                {item.product.inputs.map((el, key) => (
                                    <Badge key={key} pill className="me-1" color="primary">
                                        {el.title}
                                        {` (${el.type === 'boolean' ? 'Igen / nem' : 'Szöveg'})`}
                                    </Badge>
                                ))}
                            </Col>
                        </Row>
                    </>
                ) : (
                    <div className="mt-1">
                        <Badge pill className="align-middle mt-1" color="danger">
                            Felhasználva
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
    buttonCallback: (product: BlueboardProduct) => void;
}) => {
    return (
        <Row className="m-0 px-2 py-2 w-100">
            <Col>
                <Row>
                    <Button
                        flat
                        disabled={!(product.quantity > 0)}
                        auto
                        onClick={() => {
                            buttonCallback(product);
                        }}
                        rounded
                        color="#94f9f0"
                    >
                        <Text size={12} weight="bold" transform="uppercase">
                            Get
                        </Text>
                    </Button>
                </Row>
            </Col>
            <Col className="float-end text-end">
                {product.quantity > 0 ? (
                    product.quantity === 1 ? (
                        <Badge pill color="warning">
                            Raktáron, {product.quantity} darab
                        </Badge>
                    ) : (
                        <Badge pill color="success">
                            Raktáron, {product.quantity} darab
                        </Badge>
                    )
                ) : (
                    <Badge pill color="danger">
                        Elfogyott
                    </Badge>
                )}
                <br />
                <Badge pill color="success">
                    {product.price} LoLó
                </Badge>
            </Col>
        </Row>
    );
};

export default ProductCard;
