import * as React from 'react';
import { Button } from 'reactstrap';
import AuthLayout from '../Layouts/Auth';
import { CardText, CardBody, CardTitle, CardSubtitle, Row, Col, Spinner } from 'reactstrap';
import getGreeting from '../Utils/GetGreeting';
import fetchLolo from '../Helpers/FetchLolo';
import { useSelector } from 'react-redux';

const Home = () => {
	const handleClick = () => {
		//history.push('/test');
		console.log('nothing yet');
	};

	const user = useSelector((state) => state.control.control.user);

	const [grades, setGrades] = React.useState([]);
	const [lolo, setLolo] = React.useState([]);
	const [loloBalance, setLoloBalnce] = React.useState(null);

	React.useEffect(() => {
		fetchLolo().then((res) => {
			setLolo(res.coins.slice(0, 5));
			setLoloBalnce(res.balance);
		});
	}, []);

	return (
		<AuthLayout>
			<div className="mb-1 mt-4 blur ">
				<CardBody style={{ zIndex: '1 !important' }}>
					<CardTitle tag="h5">
						{getGreeting()} {user.name.split(' ')[1] + '!'}
					</CardTitle>
					<Row>
						<Col md="6">
							<h6 className="my-2 text-muted">Legfrissebb jegyeid</h6>
							{grades.length === 0 ? (
								<div className="row align-items-center justify-content-center">
									<Spinner color="primary" />
								</div>
							) : (
								<>
									<CardText>
										Some quick example text to build on the card title and make up the bulk of the
										card's content.
									</CardText>
									<Button>Button</Button>
								</>
							)}
						</Col>

						<Col md="6">
							{loloBalance == null ? null : (
								<h6 className="my-2 text-muted float-end">Egyenleg: {loloBalance}</h6>
							)}
							<h6 className="my-2 text-muted">Legújabb LOLO-k</h6>

							{lolo.length === 0 ? (
								<div className="row align-items-center justify-content-center">
									<Spinner color="primary" />
								</div>
							) : (
								<>
									{lolo.map((el) => (
										<div>
											<div className="dropdown-divider"></div>
										</div>
									))}
								</>
							)}
						</Col>
					</Row>
				</CardBody>
			</div>
			<div className="mb-3 mt-4 blur ">
				<CardBody style={{ zIndex: '1 !important' }}>
					<CardTitle tag="h5">Card title</CardTitle>
					<CardSubtitle tag="h6" className="mb-2 text-muted">
						Card subtitle
					</CardSubtitle>
					<CardText>
						Some quick example text to build on the card title and make up the bulk of the card's content.
					</CardText>
					<Button>Button</Button>
				</CardBody>
			</div>
			<Button color="primary" onClick={handleClick}>
				Semmi
			</Button>
		</AuthLayout>
	);
};

export default Home;
