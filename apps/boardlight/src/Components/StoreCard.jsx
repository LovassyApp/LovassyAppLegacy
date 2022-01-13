import * as React from 'react';
import { Row, Col, Badge } from 'reactstrap';
import { Card, Text, Button } from '@nextui-org/react';

const StoreCard = ({ product, callback }) => {
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
				<Row className="m-0 px-2 py-2 w-100">
					<Col>
						<Row>
							<Button
								flat
								disabled={!(product.quantity > 0)}
								auto
								onClick={() => {
									callback(product);
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
			</Card.Footer>
		</Card>
	);
};

export default StoreCard;
