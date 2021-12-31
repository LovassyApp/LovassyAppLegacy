import * as React from 'react';
import AuthLayout from '../../Layouts/Auth';
import HeaderCard from '../../Components/HeaderCard';
import { Container, Grid, Card, Row, Text, Input, Button } from '@nextui-org/react';
import TableLoader from '../../Components/TableLoader';
import { deleteCode, fetchCodes, makeCode } from '../../Helpers/QRCodeHelper';
import { MdAdd } from 'react-icons/md';
import EmptyTable from '../../Components/EmptyTable';
import { Popover, PopoverBody, Alert } from 'reactstrap';
import deleteModal from '../../Utils/DeleteModal';
import toast from 'react-hot-toast';
import { useTheme } from '@nextui-org/react';
import useBlueboardClient from '../../Hooks/useBlueboardClient';

const QRCard = ({ code, deleteCallback }) => {
	const theme = useTheme();
	return (
		<Grid>
			<Card hoverable clickable>
				<Card.Body
					onClick={() => {
						var link = document.createElement('a');
						link.href = code.image;
						link.download = 'code.png';
						document.body.appendChild(link);
						link.click();
					}}
					noPadding
				>
					<Card.Image
						objectFit="cover"
						autoResize={false}
						src={code.image}
						height={200}
						width={200}
						alt="code"
					/>
				</Card.Body>
				<Card.Footer
					style={{ background: theme.type == 'dark' ? theme.palette.accents_1 : theme.palette.background }}
					justify="flex-start"
				>
					<Row justify="space-between">
						<Text
							b
							style={{
								maxWidth: '100px',
							}}
						>
							{code.name}
						</Text>
					</Row>
					<Button
						type="button"
						size="mini"
						role="button"
						tabIndex="0"
						auto
						rounded
						color="error"
						onClick={() => {
							deleteCallback(code, theme);
						}}
					>
						Törlés
					</Button>
				</Card.Footer>
			</Card>
		</Grid>
	);
};

const AddCard = ({ bootstrap }) => {
	const [popover, setPopover] = React.useState(false);
	const [name, setName] = React.useState('');
	const [errorShow, setErrorShow] = React.useState(false);
	const [errors, setErrors] = React.useState([]);
	const [savePending, setSavePending] = React.useState(false);
	const client = useBlueboardClient();

	const togglePopover = () => {
		setName('');
		setErrorShow(false);
		setErrors([]);
		return setPopover(!popover);
	};

	const trySave = () => {
		setSavePending(true);
		client.qrcodes
			.save(name)
			.then((res) => {
				setSavePending(false);
				bootstrap();
				togglePopover();
			})
			.catch((err) => {
				setSavePending(false);
				if (err.errors != null) {
					if (err.errors.name != null) {
						setErrors(err.errors.name);
						setErrorShow(true);
					}
				} else {
					setErrors([err.message]);
					setErrorShow(true);
				}
			});
	};
	const theme = useTheme();

	return (
		<>
			<Popover flip isOpen={popover} placement="top" target="addCodeCard">
				<PopoverBody
					style={{
						background: theme.type == 'dark' ? theme.palette.accents_1 : theme.palette.background,
					}}
				>
					<Input
						fullWidth
						className="mt-2"
						clearable
						bordered
						underlined
						color={name === '' ? 'error' : 'primary'}
						shadow={false}
						onChange={(e) => setName(e.target.value)}
						labelLeft="Név: "
						initialValue={name}
					/>
					<Alert className="mt-2" color="danger" isOpen={errorShow} toggle={() => setErrorShow(false)}>
						{errors.map((el) => (
							<span>
								{' '}
								{el} <br />{' '}
							</span>
						))}
					</Alert>
					<center>
						<Button
							auto
							className="mt-2"
							loading={savePending}
							loaderType="points"
							color="gradient"
							rounded
							onClick={trySave}
						>
							Mentés
						</Button>
					</center>
				</PopoverBody>
			</Popover>
			<Grid id="addCodeCard">
				<Card onClick={togglePopover} width="100%" hoverable clickable>
					<Card.Body noPadding height="200px" width="200px">
						<Row justify="center" className="h-100" align="center">
							<MdAdd size="100" />
						</Row>
					</Card.Body>
					<Card.Footer
						style={{
							background: theme.type == 'dark' ? theme.palette.accents_1 : theme.palette.background,
						}}
						justify="flex-start"
					>
						<Row justify="space-between">
							<Text b>Kód hozzáadása</Text>
						</Row>
					</Card.Footer>
				</Card>
			</Grid>
		</>
	);
};

const QRCodes = () => {
	const [loading, setLoading] = React.useState(true);
	const [qrCodes, setQrCodes] = React.useState([]);
	const client = useBlueboardClient();

	const bootstrap = async () => {
		setLoading(true);
		client.qrcodes
			.all()
			.then((res) => {
				console.log(res);
				setQrCodes(res);
				setLoading(false);
			})
			.catch((err) => toast.error(err.message));
	};

	React.useEffect(() => {
		bootstrap();
	}, []);

	const deleteC = async (code, theme) => {
		const res = await deleteModal('Biztos, hogy törölni szeretnéd ezt a kódot?', 'Törlés - ' + code.name, theme);

		if (res.isConfirmed) {
			toast.promise(
				client.qrcodes.delete(code.id).then(() => bootstrap()),
				{
					loading: 'Törlés...',
					success: 'Sikeresen törölve!',
					error: 'Hiba történt!',
				}
			);
		}
	};

	return (
		<AuthLayout>
			<HeaderCard title="QR-kódok" />
			{loading ? (
				<center>
					<TableLoader />
				</center>
			) : (
				<Container>
					<center>{qrCodes.length === 0 ? <EmptyTable /> : null}</center>
					<Grid.Container gap={2} justify="center">
						{qrCodes.map((el, key) => (
							<QRCard key={key} deleteCallback={deleteC} code={el} />
						))}
						<AddCard bootstrap={bootstrap} />
					</Grid.Container>
				</Container>
			)}
		</AuthLayout>
	);
};

export default QRCodes;
