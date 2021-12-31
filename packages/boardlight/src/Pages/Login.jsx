import * as React from 'react';
import { InputGroup, InputGroupText, Input, FormGroup, Alert } from 'reactstrap';
import { Button, Checkbox } from '@nextui-org/react';
import BaseLogin from '../Layouts/BaseLogin';
import { MdOutlineAlternateEmail, MdOutlinePassword } from 'react-icons/md';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import getGreeting from '../Utils/GetGreeting';
import useBlueboardClient from '../Hooks/useBlueboardClient';
import useRenew from '../Hooks/useRenew';

const Login = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const client = useBlueboardClient();
	const renew = useRenew();

	const [username, setUsername] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [remember, setRemember] = React.useState(false);
	const [loading, setLoading] = React.useState(false);

	const [GLOBERR, setGLOBERR] = React.useState('');
	const [userErr, setUserErr] = React.useState([]);
	const [passwordErr, setPasswordErr] = React.useState([]);
	const [globIsVisible, globSetVisible] = React.useState(false);
	const [passIsVisible, passSetVisible] = React.useState(false);
	const [userIsVisible, userSetVisible] = React.useState(false);

	const onDismiss = () => globSetVisible(false);

	const onRememberToggle = () => {
		const newVal = !remember;
		const msg = newVal ? 'Jó döntés, ifjú padavan.' : 'Azt ugye tudod, hogy fél óra múlva ki leszel rakva innen?';
		setRemember(newVal);
		toast(msg, {
			type: newVal ? 'success' : 'error',
		});
	};

	const handleClick = (e) => {
		e.preventDefault();
		globSetVisible(false);
		passSetVisible(false);
		userSetVisible(false);
		setLoading(true);
		setTimeout(() => {
			client.auth
				.login(username, password, remember)
				.then((res) => {
					console.log(res);
					const token = res.token;
					client.account.control(token).then((res) => {
						dispatch({ type: 'control/setControl', payload: res });
						const name = res.user.name;
						toast.success(getGreeting() + (name.split(' ')[1] ?? name) + '!');
						dispatch({ type: 'token/setToken', payload: token });
						renew();
					});
				})
				.catch((err) => {
					console.log(err);
					setLoading(false);
					if (err.errors) {
						if (err.errors.email != null) {
							setUserErr(err.errors.email);
							userSetVisible(true);
						}
						if (err.errors.password != null) {
							setPasswordErr(err.errors.password);
							passSetVisible(true);
						}
					} else {
						setGLOBERR(err.message);
						globSetVisible(true);
					}
				});
		}, 0);
	};

	return (
		<BaseLogin>
			<form onSubmit={(e) => handleClick(e)}>
				<InputGroup className="mb-3">
					<InputGroupText>
						<MdOutlineAlternateEmail />
					</InputGroupText>
					<Input
						onInput={(e) => setUsername(e.target.value)}
						name="email"
						id="email"
						placeholder="E-mail cím"
					/>
				</InputGroup>
				<Alert color="danger" isOpen={userIsVisible} toggle={() => userSetVisible(false)}>
					{userErr.map((el) => (
						<span>
							{' '}
							{el} <br />{' '}
						</span>
					))}
				</Alert>
				<InputGroup className="mb-3">
					<InputGroupText>
						<MdOutlinePassword />
					</InputGroupText>
					<Input
						name="password"
						onInput={(e) => setPassword(e.target.value)}
						id="password"
						type="password"
						placeholder="Jelszó"
					/>
				</InputGroup>
				<Alert color="danger" isOpen={passIsVisible} toggle={() => passSetVisible(false)}>
					{passwordErr.map((el) => (
						<span>
							{' '}
							{el} <br />{' '}
						</span>
					))}
				</Alert>

				<div className="float-start mt-2 ml-1">
					<Checkbox
						color="gradient"
						size="small"
						rounded
						textColor="white"
						onClick={onRememberToggle}
						initialChecked={remember}
					>
						Nefelejts-pipa
					</Checkbox>
				</div>
				<br />
				<br />
				<Alert color="danger" isOpen={globIsVisible} toggle={onDismiss}>
					<h4 className="alert-heading">Hoppácska!</h4>
					<p>{GLOBERR}</p>
				</Alert>
				<Button type="submit" loading={loading} loaderType="points" color="gradient">
					Essünk néki!
				</Button>
			</form>
		</BaseLogin>
	);
};
export default Login;
