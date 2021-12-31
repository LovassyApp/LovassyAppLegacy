import * as React from 'react';
import HeaderCard from '../Components/HeaderCard';
import AuthLayout from '../Layouts/Auth';
import { useTheme, Modal, Button, Card, Container, Input, Text } from '@nextui-org/react';
import { Row, Col, Badge } from 'reactstrap';
import toast from 'react-hot-toast';
import { usePrivateChannel } from '../Hooks/SocketManager';
import { useUser } from '../Hooks/ControlHooks';
import StoreCard from '../Components/StoreCard';
import useBlueboardClient from '../Hooks/useBlueboardClient';
import TableLoader from '../Components/TableLoader';
import EmptyTable from '../Components/EmptyTable';
import { matchSorter } from 'match-sorter';
import { useStatefulEvent, useStatefulListener } from '../Hooks/EventHooks';
import { BlueboardProduct } from 'blueboard-client';

const defaultProduct = new BlueboardProduct(false, '', '', '', 0, '', '', [], '', 0, 0, false);

const ProductModalContent = ({ eventDeclaration, user, closeHandler, buyCallback }) => {
	const product = useStatefulListener(eventDeclaration);

	return (
		<>
			<Modal.Header style={{ border: 'none' }}>
				<Text id="modal-title" size={18}>
					Termékvásárlás - {product.name}
				</Text>
			</Modal.Header>
			<Modal.Body>
				<Row>
					<Col>{product.description}</Col>
				</Row>

				{product.inputs.length > 0 ? (
					<Row>
						<Col xs="4">Inputok:</Col>
						<Col>
							{product.inputs.map((el) => (
								<Badge pill className="me-1" color="primary">
									{el.title}
									{` (${el.type === 'boolean' ? 'Igen / nem' : 'Szöveg'})`}
								</Badge>
							))}
						</Col>
					</Row>
				) : null}
				<Row>
					<Col xs="4">Aktiválás:</Col>
					<Col>
						{product.codeActivated ? (
							<Badge pill color="warning">
								Csak QR kóddal aktiválható ({product.codeNames.join(', ')})
							</Badge>
						) : (
							<Badge pill color="success">
								Magában aktiválható
							</Badge>
						)}
					</Col>
				</Row>
				<Row>
					<Col xs="8" md="4">
						Végleges egyenleged:
					</Col>
					<Col>
						<Badge pill color={user.balance > 0 ? (user.balance > 2 ? 'success' : 'warning') : 'danger'}>
							{user.balance} LoLó
						</Badge>
						<br />
						<Badge pill color="danger">
							- {product.price} LoLó
						</Badge>
						<br />
						<Badge
							pill
							color={
								Number(user.balance - product.price) > 0
									? Number(user.balance - product.price) > 2
										? 'success'
										: 'warning'
									: 'danger'
							}
						>
							{Number(user.balance - product.price)} LoLó
						</Badge>
						{product.price > user.balance ? (
							<Badge pill className="ms-1" color="danger">
								Nincs elég LoLód!
							</Badge>
						) : null}
					</Col>
				</Row>
				<Row>
					<Col xs="4">Készlet:</Col>
					<Col>
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
					</Col>
				</Row>
			</Modal.Body>
			<Modal.Footer style={{ overflow: 'visible', border: 'none' }}>
				<Button auto rounded flat color="error" onClick={closeHandler}>
					Mégsem
				</Button>
				<Button
					auto
					rounded
					color="success"
					disabled={product.price > user.balance || product.quantity < 1}
					onClick={() => {
						buyCallback(product.id);
					}}
				>
					Megveszem
				</Button>
			</Modal.Footer>
		</>
	);
};

const Store = () => {
	const theme = useTheme();
	const user = useUser();
	const client = useBlueboardClient();

	const [loading, setLoading] = React.useState(true);
	const [products, setProducts] = React.useState([]);
	const [visible, setVisible] = React.useState(false);

	const [productRef, product, setProduct, eventDeclaration] = useStatefulEvent(0, 'storeEventCustom');

	const openBuy = (product) => {
		setProduct(product);
		setVisible(true);
	};
	const closeHandler = () => {
		setProduct(defaultProduct);
		setVisible(false);
	};

	const updateCallback = (data) => {
		const product = data.product;
		const products = data.products;

		if (product.id === productRef.current.id) {
			setProduct(product);
		}

		setProducts(products);
	};

	const [query, setQuery] = React.useState('');

	const renderedProducts =
		query === ''
			? products
			: matchSorter(products, query, { keys: ['name', 'description'], threshold: matchSorter.rankings.CONTAINS });

	const bootstrap = async () => {
		setLoading(true);
		client.store
			.all()
			.then((res) => {
				setProducts(res);
				setLoading(false);
			})
			.catch((err) => toast.error(err.message));
	};

	const buyCallback = async (id) => {
		closeHandler();
		toast.promise(
			client.store.buy(id).catch((err) => toast.error(err.message)),
			{
				loading: 'Tranzakció folyamatban...',
				success: 'Siker!',
				error: 'Hiba történt!',
			}
		);
	};

	React.useEffect(() => {
		bootstrap();
	}, []);

	usePrivateChannel('Store', 'ProductUpdated', updateCallback);

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
				<ProductModalContent
					eventDeclaration={eventDeclaration}
					user={user}
					closeHandler={closeHandler}
					buyCallback={buyCallback}
				/>
			</Modal>

			<HeaderCard title="Bazár" />
			{loading ? (
				<center>
					<TableLoader />
				</center>
			) : (
				<>
					<Container fluid style={{ width: '95%' }}>
						<Card hoverable>
							<Row>
								<Col md="4" sm="12">
									<Text className="mt-1">
										Jelenlegi egyenleged:{' '}
										<Badge
											pill
											color={
												user.balance > 0 ? (user.balance > 2 ? 'success' : 'warning') : 'danger'
											}
										>
											{user.balance} LoLó
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
					<Container fluid style={{ width: '95%' }}>
						{renderedProducts.length > 0 ? (
							<Row className="mt-4">
								{renderedProducts.map((el) => (
									<Col key={el.id} className="mt-2 mb-3" md="3">
										<StoreCard product={el} callback={openBuy} />
									</Col>
								))}
							</Row>
						) : (
							<center>
								<div className="mt-4">
									<EmptyTable />
								</div>
							</center>
						)}
					</Container>
				</>
			)}
		</AuthLayout>
	);
};

export default Store;
