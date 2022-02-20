import * as React from 'react';
import AuthLayout from '../../Layouts/Auth';
import HeaderCard from '../../Components/HeaderCard';
import { useHistory, useParams } from 'react-router';
import { Loading, Input, Button, Switch, Textarea, useTheme } from '@nextui-org/react';
import { Row, Col, Card, DropdownItem, DropdownToggle, DropdownMenu, UncontrolledDropdown, Alert } from 'reactstrap';
import { Container, Grid, Card as NextCard, Text, Modal } from '@nextui-org/react';
import toast from 'react-hot-toast';
import TableLoader from '../../Components/TableLoader';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import MDEditor from '@uiw/react-md-editor';
import EmptyTable from '../../Components/EmptyTable';
import InputRenderer from '../../Components/InputRenderer';
import ImageDropzone from '../../Components/ImageDropzone';
import { BoardlightFile, getDefImg, getImageBase64, importImage } from '../../Helpers/ImageUtils';
import { useBlueboardClient } from 'blueboard-client-react';
import { BlueboardNotFoundException, BlueboardProduct, BlueboardProductInput, BlueboardQRCode } from 'blueboard-client';
import Center from '../../Components/Center';
import { FormElement } from '@nextui-org/react/esm/input/input-props';
import { usePermissions } from '../../Hooks/ControlHooks';
import Four0Three from '../403';
import { checkPermission } from '../../Helpers/Middleware';

const animatedComponents = makeAnimated();

const EditProduct = () => {
    const { id } = useParams() as { id: string };
    const history = useHistory();
    const theme = useTheme();
    const client = useBlueboardClient();

    if (id !== 'new' && isNaN(Number(id))) {
        history.push('/404');
    }

    const [qrcodes, setQrCodes] = React.useState<any[]>([]);
    const [selectedCodes, setSelectedCodes] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [savePending, setSavePending] = React.useState(false);
    const [name, setName] = React.useState('Random kimentés valami izé');
    const [description, setDescription] = React.useState('Rövid sokatmondó leírás');
    const [files, setFiles] = React.useState<BoardlightFile[]>([]);
    const [markdown, setMarkdown] = React.useState('**Markdown a beváltáshoz / leíráshoz a shopban**<br>jej<br>kúl');
    const [codeIsDisabled, setCodeDisabled] = React.useState(true);
    const [price, setPrice] = React.useState(1);
    const [quantity, setQuantity] = React.useState(1);
    const [modalShow, setModalShow] = React.useState(false);
    const [inputs, setInputs] = React.useState<BlueboardProductInput[]>([]);
    const [visible, setVisible] = React.useState(false);
    const closeHandler = () => {
        setModalShow(false);
    };

    const [errors, setErrors] = React.useState<any>({});

    const bootstrap = async () => {
        if (id !== 'new') {
            let product = {} as BlueboardProduct;
            try {
                product = (await client.products.get(Number(id))).pop() as BlueboardProduct;
            } catch (e) {
                if (e instanceof BlueboardNotFoundException) {
                    history.push('/404');
                } else {
                    toast.error((e as any).message);
                }
            }
            const image = await importImage(product.imageUrl);
            setInputs(product.inputs);
            setMarkdown(product.markdownContent);
            setCodeDisabled(!Boolean(product.codeActivated));
            setName(product.name);
            setPrice(product.price);
            setQuantity(product.quantity);
            setSelectedCodes((product as any).codes.map((el: BlueboardQRCode) => ({ value: el.id, label: el.name })));
            setFiles([image]);
            setVisible(product.visible);
        } else {
            setFiles([getDefImg()]);
        }

        await client.qrcodes.all().then((res) => setQrCodes(res.map((el) => ({ value: el.id, label: el.name }))));

        setLoading(false);
    };

    React.useEffect(() => {
        setLoading(true);
        if (id !== 'new' && isNaN(Number(id))) {
            setFiles([getDefImg()]);
            setLoading(false);
        } else {
            bootstrap();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const title = 'Termék - ' + name;

    const AddTextbox = () => {
        let obj = {
            name: 'semmi',
            type: 'textbox' as 'textbox',
            title: 'Cím',
        };

        setInputs([...inputs, obj]);
    };

    const addBoolean = () => {
        let obj = {
            name: 'semmi',
            type: 'boolean' as 'boolean',
            title: 'Cím',
        };

        setInputs([...inputs, obj]);
    };

    const setInputValName = (inputValue: any, key: number) => {
        const newInputs = inputs.map((value, index) => {
            return index === key ? { ...value, name: inputValue } : value;
        });

        setInputs(newInputs);
    };

    const setInputTitle = (inputValue: any, key: number) => {
        const newInputs = inputs.map((value, index) => {
            return index === key ? { ...value, title: inputValue } : value;
        });

        setInputs(newInputs);
    };

    const deleteInput = (index: number) => {
        const newInputs = [...inputs.slice(0, index), ...inputs.slice(index + 1)];
        setInputs(newInputs);
    };

    const getErrors = (name: string) => {
        const error = errors[name] ?? [];
        let str = '';
        error.forEach((el: string) => {
            str = str + el + '\n';
        });

        return str;
    };

    const makeInputString = (id: number, name: string) => {
        return 'inputs.' + id + '.' + name;
    };

    const trySave = async () => {
        const data = {
            id: id,
            name: String(name),
            description: String(description),
            markdownContent: String(markdown),
            codeActivated: Boolean(!codeIsDisabled),
            codes: selectedCodes.map((code) => code.value ?? code),
            price: Number(price),
            quantity: Number(quantity),
            inputs: inputs,
            image: await getImageBase64(files[0]),
            visible: visible,
        };

        const checkForInputError = (errObj: any) => {
            const str = JSON.stringify(errObj);
            const isset = str.includes('inputs.');
            if (isset) {
                setModalShow(true);
            }
        };

        setSavePending(true);

        setErrors({});
        client.products
            .save(data)
            .then(() => {
                setSavePending(false);
                setErrors({});
                toast.success('Siker!');
                history.push('/admin/products');
            })
            .catch((err) => {
                setSavePending(false);
                if (err.errors) {
                    setErrors(err.errors);
                    checkForInputError(err.errors);
                } else {
                    if (err.message === 'Network Error') {
                        const message = 'Internal networking error. You might have to check your connection.';
                        setErrors((errors: any) => ({ ...errors, globalErr: message }));
                    } else {
                        setErrors((errors: any) => ({ ...errors, globalErr: err.message }));
                    }
                }
            });
    };

    const userPermissions = usePermissions();

    if (id === 'new' && !checkPermission('Products.create', userPermissions)) {
        return <Four0Three />;
    }

    if (id !== 'new' && !isNaN(Number(id)) && !checkPermission('Products.update', userPermissions)) {
        return <Four0Three />;
    }

    return (
        <AuthLayout>
            <Modal
                closeButton
                blur
                aria-labelledby="modal-title"
                open={modalShow}
                onClose={closeHandler}
                preventClose
                width="650px"
            >
                <Modal.Header style={{ border: 'none' }}>
                    <Text id="modal-title" size={18}>
                        Inputok
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    {inputs.length === 0 ? <EmptyTable /> : null}
                    {inputs.map((value, key) => (
                        <Row key={key}>
                            <Text b>{value.type === 'textbox' ? 'Textbox' : 'Switch'}</Text>
                            <Col md="5">
                                <Input
                                    fullWidth
                                    bordered
                                    underlined
                                    min="1"
                                    shadow={false}
                                    onChange={(e) => setInputValName(e.target.value, key)}
                                    labelLeft="ValueName: "
                                    initialValue={value.name}
                                    color={getErrors(makeInputString(key, 'name')) === '' ? 'primary' : 'error'}
                                    status={getErrors(makeInputString(key, 'name')) === '' ? 'default' : 'error'}
                                    helperColor={getErrors(makeInputString(key, 'name')) === '' ? 'default' : 'error'}
                                    helperText={getErrors(makeInputString(key, 'name'))}
                                />
                            </Col>
                            <Col md="5">
                                <Input
                                    fullWidth
                                    bordered
                                    underlined
                                    min="1"
                                    shadow={false}
                                    onChange={(e) => setInputTitle(e.target.value, key)}
                                    labelLeft="Név: "
                                    initialValue={value.title}
                                    color={getErrors(makeInputString(key, 'title')) === '' ? 'primary' : 'error'}
                                    status={getErrors(makeInputString(key, 'title')) === '' ? 'default' : 'error'}
                                    helperColor={getErrors(makeInputString(key, 'title')) === '' ? 'default' : 'error'}
                                    helperText={getErrors(makeInputString(key, 'title'))}
                                />
                            </Col>
                            <Col md="2">
                                <Button
                                    type="button"
                                    size="mini"
                                    role="button"
                                    tabIndex={0}
                                    auto
                                    rounded
                                    color="error"
                                    onClick={() => deleteInput(key)}
                                >
                                    Törlés
                                </Button>
                            </Col>
                        </Row>
                    ))}
                </Modal.Body>
                <Modal.Footer style={{ overflow: 'visible', border: 'none' }}>
                    <UncontrolledDropdown direction="up">
                        <DropdownToggle data-toggle="dropdown" tag="div">
                            <Button auto flat color="success">
                                Input hozzáadása
                            </Button>
                        </DropdownToggle>
                        <DropdownMenu
                            dark={theme.type === 'dark'}
                            style={{
                                marginBottom: 5,
                                borderRadius: 10,
                                background: theme.type === 'dark' ? theme.palette.background : theme.palette.accents_1,
                            }}
                        >
                            <DropdownItem header>Input típusok</DropdownItem>
                            <DropdownItem onClick={AddTextbox}>Szövegdoboz</DropdownItem>
                            <DropdownItem onClick={addBoolean}>Búlín</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    <Button auto flat color="error" onClick={closeHandler}>
                        klóz
                    </Button>
                </Modal.Footer>
            </Modal>
            <HeaderCard title={loading ? <Loading color="white" /> : title}></HeaderCard>
            {loading ? (
                <Center>
                    <TableLoader />
                </Center>
            ) : (
                <Container fluid style={{ width: '95%' }}>
                    <Alert className="mt-2" color="danger" isOpen={errors.globalErr !== undefined}>
                        Fatal error: {errors.globalErr}
                    </Alert>
                    <Row className="ml-2 mr-2">
                        <Col md="6">
                            <Card
                                style={{
                                    background:
                                        theme.type === 'dark' ? theme.palette.accents_1 : theme.palette.background,
                                }}
                            >
                                <MDEditor value={markdown} onChange={(e) => setMarkdown(e as string)} preview="edit" />
                                <div className="mt-4 mb-2">
                                    <Textarea
                                        bordered
                                        width="100%"
                                        rows={4}
                                        shadow={false}
                                        placeholder="Rövid leírás"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        color={getErrors('description') === '' ? 'primary' : 'error'}
                                        status={getErrors('description') === '' ? 'default' : 'error'}
                                        helperColor={getErrors('description') === '' ? 'default' : 'error'}
                                        helperText={getErrors('description')}
                                    />
                                </div>

                                <div className="mt-4 mb-2">
                                    <ImageDropzone files={files} setFiles={setFiles} />
                                    <Alert className="mt-2 mx-4" color="danger" isOpen={getErrors('image') !== ''}>
                                        {getErrors('image')}
                                    </Alert>
                                </div>
                                <Row className="mx-2">
                                    <Col md="6" className="my-2">
                                        <Row>
                                            <Col xs="9">
                                                <Text className="mt-1">Termék látható?</Text>
                                            </Col>
                                            <Col xs="3">
                                                <Switch checked={visible} onChange={() => setVisible(!visible)} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Input
                                                fullWidth
                                                clearable
                                                bordered
                                                underlined
                                                shadow={false}
                                                onChange={(e) => setName(e.target.value)}
                                                labelLeft="Név: "
                                                initialValue={name}
                                                color={getErrors('name') === '' ? 'primary' : 'error'}
                                                status={getErrors('name') === '' ? 'default' : 'error'}
                                                helperColor={getErrors('name') === '' ? 'default' : 'error'}
                                                helperText={getErrors('name')}
                                            />
                                        </Row>
                                    </Col>
                                    <Col md="6" className="my-2">
                                        <Row>
                                            <Col xs="9">
                                                <Text className="mt-1">Aktiváló kódok:</Text>
                                            </Col>
                                            <Col xs="3">
                                                <Switch
                                                    checked={!codeIsDisabled}
                                                    onChange={() => setCodeDisabled(!codeIsDisabled)}
                                                />
                                            </Col>
                                        </Row>
                                        <Select
                                            components={animatedComponents}
                                            closeMenuOnSelect={false}
                                            isMulti
                                            defaultValue={selectedCodes}
                                            theme={(dropTheme) => {
                                                return {
                                                    ...dropTheme,
                                                    borderRadius: 4,
                                                    colors: {
                                                        ...dropTheme.colors,
                                                        primary: theme.palette.primary,
                                                        primary25: theme.palette.primary,
                                                        primary50: theme.palette.primary,
                                                        primary75: theme.palette.primary,
                                                        danger: theme.palette.errorDark,
                                                        dangerLight: theme.palette.secondary,
                                                        neutral0: theme.palette.accents_1,
                                                        neutral10: theme.palette.accents_2,
                                                        neutral20: theme.palette.accents_2,
                                                        neutral30: theme.palette.accents_3,
                                                        neutral40: theme.palette.accents_4,
                                                        neutral50: theme.palette.accents_5,
                                                        neutral60: theme.palette.accents_6,
                                                        neutral70: theme.palette.accents_7,
                                                        neutral80: theme.palette.accents_8,
                                                        neutral90: theme.palette.accents_8,
                                                    },
                                                };
                                            }}
                                            isDisabled={codeIsDisabled}
                                            options={qrcodes}
                                            onChange={(e) => setSelectedCodes(e.map((e: any) => e.value))}
                                        />
                                        <Alert className="mt-2" color="danger" isOpen={getErrors('codes') !== ''}>
                                            {getErrors('codes')}
                                        </Alert>
                                    </Col>
                                </Row>
                                <Row className="mx-2">
                                    <Col md="6">
                                        <Input
                                            fullWidth
                                            bordered
                                            underlined
                                            type="number"
                                            min="1"
                                            shadow={false}
                                            onChange={(e: React.ChangeEvent<FormElement>) =>
                                                setPrice(Number(e.target.value))
                                            }
                                            labelLeft="Ár: "
                                            labelRight="LoLó"
                                            initialValue={String(price)}
                                            color={getErrors('price') === '' ? 'primary' : 'error'}
                                            status={getErrors('price') === '' ? 'default' : 'error'}
                                            helperColor={getErrors('price') === '' ? 'default' : 'error'}
                                            helperText={getErrors('price')}
                                        />
                                    </Col>
                                    <Col md="6">
                                        <Input
                                            fullWidth
                                            bordered
                                            underlined
                                            type="number"
                                            min="0"
                                            shadow={false}
                                            onChange={(e: React.ChangeEvent<FormElement>) =>
                                                setQuantity(Number(e.target.value))
                                            }
                                            labelLeft="Mennyiség: "
                                            initialValue={String(quantity)}
                                            color={getErrors('quantity') === '' ? 'primary' : 'error'}
                                            status={getErrors('quantity') === '' ? 'default' : 'error'}
                                            helperColor={getErrors('quantity') === '' ? 'default' : 'error'}
                                            helperText={getErrors('quantity')}
                                        />
                                    </Col>
                                </Row>
                                <Grid.Container gap={2} justify="center" className="my-2">
                                    <Grid>
                                        <Button
                                            auto
                                            className="mt-2 mx-1"
                                            color="primary"
                                            flat
                                            rounded
                                            onClick={() => setModalShow(true)}
                                        >
                                            Inputok
                                        </Button>
                                        <Button
                                            auto
                                            className="mt-2 mx-1"
                                            loading={savePending}
                                            loaderType="points"
                                            color="gradient"
                                            rounded
                                            onClick={trySave}
                                        >
                                            Mentés
                                        </Button>
                                    </Grid>
                                </Grid.Container>
                            </Card>
                        </Col>
                        <Col md="6">
                            <Grid.Container gap={2} justify="center">
                                <Grid md={6}>
                                    <NextCard width="100%">
                                        <MDEditor.Markdown source={markdown} />
                                        <InputRenderer inputs={inputs} />
                                    </NextCard>
                                </Grid>
                                <Grid md={6}>
                                    <NextCard width="100%" color="#0f1114" cover>
                                        <NextCard.Header
                                            style={{
                                                position: 'absolute',
                                                zIndex: 1,
                                                top: 5,
                                                border: 'none',
                                            }}
                                        >
                                            <Col>
                                                <Text h4 weight="bold" color="white">
                                                    {name}
                                                </Text>

                                                <Text className="text-justify mt-2" p color="white">
                                                    {description}
                                                </Text>
                                            </Col>
                                        </NextCard.Header>
                                        <NextCard.Body>
                                            <NextCard.Image
                                                autoResize={false}
                                                src={files[0].preview}
                                                height={300}
                                                alt="ez nemtom mi"
                                            />
                                        </NextCard.Body>
                                        <NextCard.Footer
                                            blur
                                            border
                                            borderColor="rgba(15, 17, 20, 0.4)"
                                            style={{ position: 'absolute', zIndex: 1, bottom: 0 }}
                                        >
                                            <Row>
                                                <Col>
                                                    <Row justify="flex-end">
                                                        <Button flat auto rounded color="#94f9f0">
                                                            <Text size={12} weight="bold" transform="uppercase">
                                                                Beváltás
                                                            </Text>
                                                        </Button>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </NextCard.Footer>
                                    </NextCard>
                                </Grid>
                            </Grid.Container>
                        </Col>
                    </Row>
                </Container>
            )}
        </AuthLayout>
    );
};

export default EditProduct;
