import React from 'react';
import AuthLayout from '../../Layouts/Auth';
import HeaderCard from '../../Components/HeaderCard';
import DataTable from 'react-data-table-component';
import { Container, Col, Row, Card, CardBody, Badge } from 'reactstrap';
import { Button, useTheme } from '@nextui-org/react';
import TableLoader from '../../Components/TableLoader';
import { MdAdd } from 'react-icons/md';
import { useHistory } from 'react-router';
import toast from 'react-hot-toast';
import EmptyTable from '../../Components/EmptyTable';
import Middleware from '../../Helpers/Middleware';
import deleteModal from '../../Utils/DeleteModal';
import useBlueboardClient from '../../Hooks/useBlueboardClient';

const Groups = () => {
	const [groups, setGroups] = React.useState([]);
	const [loading, setLoading] = React.useState(true);
	const history = useHistory();
	const theme = useTheme();
	const client = useBlueboardClient();

	const bootstrap = async () => {
		setLoading(true);
		client.groups
			.all()
			.then((res) => {
				setGroups(res);
				setLoading(false);
			})
			.catch((err) => toast.error(err.message));
	};

	React.useEffect(() => {
		bootstrap();
	}, []);

	const deleteRow = async (row) => {
		const res = await deleteModal('Biztos, hogy törölni szeretnéd ezt a csoportot?', 'Törlés - ' + row.name, theme);

		if (res.isConfirmed) {
			toast.promise(
				client.groups.delete(row.id).then(() => bootstrap()),
				{
					loading: 'Törlés...',
					success: 'Sikeresen törölve!',
					error: 'Hiba történt!',
				}
			);
		}
	};

	const columns = [
		{
			name: 'ID',
			selector: (row) => row.id,
		},
		{
			name: 'Csoportnév',
			selector: (row) => row.name,
		},
		{
			name: 'Jogok',
			cell: (row) => (
				<div>
					{row.permissions.map((el, key) => (
						<Badge key={key} className="badge-white m-1">
							{el}
						</Badge>
					))}
				</div>
			),
			grow: 3,
			wrap: true,
		},
		{
			name: '',
			cell: (el) => {
				return (
					<>
						<Button
							className="mx-1"
							auto
							rounded
							color="primary"
							onClick={() => history.push('/admin/permissions/edit/' + el.id)}
						>
							Szerkesztés
						</Button>
						<Button className="mx-1" auto rounded color="error" onClick={() => deleteRow(el)}>
							Törlés
						</Button>
					</>
				);
			},
		},
	];

	return (
		<AuthLayout>
			<HeaderCard title="Felhasználói csoportok" />
			<Container fluid style={{ width: '95%' }}>
				<Row className="ml-2 mr-2">
					<Col md="12">
						<Card
							style={{
								background: theme.type == 'dark' ? theme.palette.accents_1 : theme.palette.background,
							}}
						>
							<CardBody style={{ height: 'calc(100vh - 320px)' }}>
								<DataTable
									highlightOnHover
									pointerOnHover
									columns={columns}
									data={groups}
									theme={theme.type}
									progressPending={loading}
									progressComponent={<TableLoader />}
									noDataComponent={<EmptyTable />}
									fixedHeader
									fixedHeaderScrollHeight="calc(100vh - 350px)"
								/>
							</CardBody>
						</Card>
					</Col>
					<div className="mt-2"></div>
					<center>
						<Middleware
							permission="Permissions.add"
							component={
								<>
									<Button
										color="gradient"
										rounded
										onClick={() => history.push('/admin/permissions/edit/new')}
									>
										<MdAdd />
										Csoport hozzáadása
									</Button>
								</>
							}
						/>
					</center>
				</Row>
			</Container>
		</AuthLayout>
	);
};

export default Groups;
