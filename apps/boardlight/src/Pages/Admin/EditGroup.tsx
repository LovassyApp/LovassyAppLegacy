import * as React from 'react';
import AuthLayout from '../../Layouts/Auth';
import HeaderCard from '../../Components/HeaderCard';
import { useHistory, useParams } from 'react-router';
import TableLoader from '../../Components/TableLoader';
import {
    Loading,
    Input,
    Button,
    Text,
    Switch,
    useTheme,
    Card as NextUICard,
} from '@nextui-org/react';

import {
    Row,
    Col,
    CardBody,
    Card,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Badge,
    Alert,
    Container,
} from 'reactstrap';
import toast from 'react-hot-toast';
import { checkPermission } from '../../Helpers/Middleware';
import Four0Three from '../403';
import { usePermissions } from '../../Hooks/ControlHooks';
import { useBlueboardClient } from 'blueboard-client-react';
import { BlueboardNotFoundException, BlueboardUserGroup } from 'blueboard-client';
import Center from '../../Components/Center';

const EditGroup = (): JSX.Element => {
    const { id } = useParams() as { id: string };
    const history = useHistory();
    const theme = useTheme();
    const client = useBlueboardClient();

    const userPermissions = usePermissions();

    if (id !== 'new' && isNaN(Number(id))) {
        history.push('/404');
    }

    const [permissions, setPermissions] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [name, setName] = React.useState('');
    const [tab, setTab] = React.useState(0);
    const [checked, setChecked] = React.useState<string[]>([]);
    const [savePending, setSavePending] = React.useState(false);

    const [GLOBERR, setGLOBERR] = React.useState('');
    const [nameErr, setNameErr] = React.useState([]);
    const [permissionsErr, setPermissionsErr] = React.useState([]);
    const [globIsVisible, globSetVisible] = React.useState(false);
    const [nameIsVisible, nameSetVisible] = React.useState(false);
    const [permissionsIsVisible, permissionsSetVisible] = React.useState(false);

    const getChecked = (permissionString: string): boolean => {
        return checked.includes(permissionString);
    };

    const togglePermission = (permissionString: string): void => {
        const inArray = getChecked(permissionString);
        const newArr = inArray
            ? checked.filter((permString) => permString !== permissionString)
            : [...checked, permissionString];
        setChecked(newArr);
    };

    React.useEffect(() => {
        client.scopes
            .all()
            .then((res) => {
                setPermissions(Object.values(res as any));
                if (id !== 'new') {
                    client.groups
                        .get(Number(id))
                        .then((res) => {
                            setName(res.name);
                            setChecked(res.permissions);
                            setLoading(false);
                        })
                        .catch((err) => {
                            if (err instanceof BlueboardNotFoundException) {
                                history.push('/404');
                            } else {
                                toast.error(err.message);
                            }
                        });
                } else {
                    setLoading(false);
                }
            })
            .catch((err) => toast.error(err.message));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const trySave = (): void => {
        const data = new BlueboardUserGroup(id, name, checked);
        setSavePending(true);
        client.groups
            .save(data)
            .then(() => {
                toast.success('Sikeres mentés!');
                history.push('/admin/permissions');
            })
            .catch((err) => {
                setSavePending(false);
                console.log(err);
                if (err.errors !== undefined) {
                    if (err.errors.name !== undefined) {
                        setNameErr(err.errors.name);
                        nameSetVisible(true);
                    }
                    if (err.errors.permissions !== undefined) {
                        setPermissionsErr(err.errors.permissions);
                        permissionsSetVisible(true);
                    }

                    if (err.errors.permissions === undefined && err.errors.name === undefined) {
                        setGLOBERR(err.message);
                        globSetVisible(true);
                    }
                } else {
                    setGLOBERR(err.message);
                    globSetVisible(true);
                }
            });
    };

    if (id === 'new' && !checkPermission('Permissions::CreateGroup', userPermissions)) {
        return <Four0Three />;
    }

    if (
        id !== 'new' &&
        !isNaN(Number(id)) &&
        !checkPermission('Permissions::UpdateGroup', userPermissions)
    ) {
        return <Four0Three />;
    }

    return (
        <AuthLayout>
            <HeaderCard title={loading ? <Loading color="white" /> : `Csoport: ${name}`} />
            {loading ? (
                <Center>
                    <TableLoader />
                </Center>
            ) : (
                <Container fluid={true} style={{ width: '95%' }}>
                    <Row className="ml-2 mr-2">
                        <Col md="12">
                            <Card
                                style={{
                                    background:
                                        theme.type === 'dark'
                                            ? theme.palette.accents_1
                                            : theme.palette.background,
                                }}>
                                <CardBody>
                                    <Center>
                                        <Input
                                            style={{ width: '200px' }}
                                            className="mt-2"
                                            clearable={true}
                                            bordered={true}
                                            underlined={true}
                                            color={name === '' ? 'error' : 'primary'}
                                            shadow={false}
                                            onChange={(e) => setName(e.target.value)}
                                            labelLeft="Név: "
                                            initialValue={name}
                                        />
                                        <Button
                                            auto={true}
                                            className="mt-2"
                                            loading={savePending}
                                            loaderType="points"
                                            color="gradient"
                                            rounded={true}
                                            onClick={trySave}>
                                            Mentés
                                        </Button>
                                        <Alert
                                            className="mt-2"
                                            color="danger"
                                            isOpen={nameIsVisible}
                                            toggle={() => nameSetVisible(false)}>
                                            {nameErr.map((el) => (
                                                <span key={el}>
                                                    {' '}
                                                    {el} <br />{' '}
                                                </span>
                                            ))}
                                        </Alert>
                                        <Alert
                                            className="mt-2"
                                            color="danger"
                                            isOpen={permissionsIsVisible}
                                            toggle={() => permissionsSetVisible(false)}>
                                            {permissionsErr.map((el) => (
                                                <span key={el}>
                                                    {' '}
                                                    {el} <br />{' '}
                                                </span>
                                            ))}
                                        </Alert>
                                        <Alert
                                            color="danger"
                                            className="mt-2"
                                            isOpen={globIsVisible}
                                            toggle={() => globSetVisible(false)}>
                                            <h4 className="alert-heading">Hoppácska!</h4>
                                            <p>{GLOBERR}</p>
                                        </Alert>
                                        <p className="mt-3">Jogosultságok:</p>
                                    </Center>
                                    <div className="dropdown-divider" />
                                    <div className="mt-2">
                                        <Nav pills={true}>
                                            {permissions.map((el, key) => (
                                                // eslint-disable-next-line react/no-array-index-key
                                                <NavItem key={key}>
                                                    <NavLink
                                                        active={tab === key}
                                                        href="#"
                                                        onClick={() => setTab(key)}>
                                                        {el.scopeDisplayName}
                                                    </NavLink>
                                                </NavItem>
                                            ))}
                                        </Nav>
                                        <TabContent className="mt-2" activeTab={tab}>
                                            {permissions.map((el, key) => (
                                                // eslint-disable-next-line react/no-array-index-key
                                                <TabPane key={key} tabId={key}>
                                                    <Row>
                                                        {el.permissions.map(
                                                            (el: any, key: number) => (
                                                                <Col
                                                                    md="6"
                                                                    className="mt-2"
                                                                    // eslint-disable-next-line react/no-array-index-key
                                                                    key={key}>
                                                                    <NextUICard
                                                                        color={
                                                                            getChecked(
                                                                                el.permissionString,
                                                                            )
                                                                                ? 'default'
                                                                                : theme.palette
                                                                                      .accents_2
                                                                        }
                                                                        width="100%"
                                                                        onClick={() =>
                                                                            togglePermission(
                                                                                el.permissionString,
                                                                            )
                                                                        }
                                                                        bordered={true}
                                                                        hoverable={true}
                                                                        clickable={true}>
                                                                        <Text h5={true}>
                                                                            {el.displayName}{' '}
                                                                            <Badge
                                                                                pill={true}
                                                                                className="badge-white">
                                                                                {
                                                                                    el.permissionString
                                                                                }
                                                                            </Badge>{' '}
                                                                        </Text>
                                                                        <p>{el.description}</p>
                                                                        <Switch
                                                                            checked={getChecked(
                                                                                el.permissionString,
                                                                            )}
                                                                        />
                                                                    </NextUICard>
                                                                </Col>
                                                            ),
                                                        )}
                                                    </Row>
                                                </TabPane>
                                            ))}
                                        </TabContent>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            )}
        </AuthLayout>
    );
};

export default EditGroup;
