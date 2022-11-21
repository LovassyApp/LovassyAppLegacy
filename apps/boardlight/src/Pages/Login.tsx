import * as React from 'react';
import { InputGroup, InputGroupText, Input, Alert } from 'reactstrap';
import { Button, Checkbox, Link } from '@nextui-org/react';
import BaseLogin from '../Layouts/BaseLogin';
import { MdOutlineAlternateEmail, MdOutlinePassword } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import getGreeting from '../Helpers/GetGreeting';
import { useBlueboardClient } from 'blueboard-client-react';
import useRenew from '../Hooks/useRenew';
import { useHistory } from 'react-router-dom';

const Login = (): JSX.Element => {
    const dispatch = useDispatch();
    const client = useBlueboardClient();
    const renew = useRenew();

    const history = useHistory();

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

    const onRememberToggle = (): void => {
        const newVal = !remember;
        setRemember(newVal);
        if (newVal) {
            toast.success('Jó döntés, ifjú padavan.');
        } else {
            toast.error('Azt ugye tudod, hogy fél óra múlva ki leszel rakva innen?');
        }
    };

    const handleClick = (e: React.FormEvent): void => {
        e.preventDefault();
        globSetVisible(false);
        passSetVisible(false);
        userSetVisible(false);
        setLoading(true);
        setTimeout(() => {
            client.auth
                .login(username, password, remember)
                .then((res) => {
                    const { token } = res;
                    client.account.control(token).then((res) => {
                        dispatch({ type: 'control/setControl', payload: res });
                        const { name } = res.user;
                        toast.success(`${getGreeting() + (name.split(' ')[1] ?? name)}!`);
                        dispatch({ type: 'token/setToken', payload: token });
                        renew();
                    });
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                    if (err.errors) {
                        if (err.errors.email !== undefined) {
                            setUserErr(err.errors.email);
                            userSetVisible(true);
                        }
                        if (err.errors.password !== undefined) {
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
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setUsername(e.target.value)
                        }
                        name="email"
                        id="email"
                        placeholder="E-mail cím"
                    />
                </InputGroup>

                <Alert color="danger" isOpen={userIsVisible} toggle={() => userSetVisible(false)}>
                    {userErr.map((el) => (
                        <span key={el}>
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
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setPassword(e.target.value)
                        }
                        id="password"
                        type="password"
                        placeholder="Jelszó"
                    />
                </InputGroup>
                <Alert color="danger" isOpen={passIsVisible} toggle={() => passSetVisible(false)}>
                    {passwordErr.map((el) => (
                        <span key={el}>
                            {' '}
                            {el} <br />{' '}
                        </span>
                    ))}
                </Alert>

                <div className="float-start mt-2 ml-1">
                    <Checkbox
                        color="gradient"
                        size="small"
                        rounded={true}
                        onClick={onRememberToggle}
                        initialChecked={remember}
                        // @ts-ignore
                        textColor="white">
                        Nefelejts-pipa
                    </Checkbox>
                </div>
                <br />
                <br />
                <Alert color="danger" isOpen={globIsVisible} toggle={() => globSetVisible(false)}>
                    <h4 className="alert-heading">Hoppácska!</h4>
                    <p>{GLOBERR}</p>
                </Alert>
                <Button type="submit" loading={loading} loaderType="points" color="gradient">
                    Essünk néki!
                </Button>
            </form>
            <div className="mt-2" />
            <Link
                href="/register"
                onClick={(e) => {
                    e.preventDefault();
                    history.push('/register');
                }}>
                Még nincs fiókod? - Regisztrálás
            </Link>
            <br />
            <Link
                href="#"
                onClick={() => {
                    dispatch({ type: 'privacyPolicyModal/openPrivacyPolicyModal' });
                }}>
                Adatvédelem
            </Link>
        </BaseLogin>
    );
};
export default Login;
