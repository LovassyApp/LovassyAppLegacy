import React from 'react';
import AuthLayout from '../../Layouts/Auth';
import HeaderCard from '../../Components/HeaderCard';
import DataTable from 'react-data-table-component';
import { Container, Col, Row, Card, CardBody, Badge } from 'reactstrap';
import { Button, useTheme } from '@nextui-org/react';
import TableLoader from '../../Components/TableLoader';
import { useHistory } from 'react-router';
import toast from 'react-hot-toast';
import EmptyTable from '../../Components/EmptyTable';
import deleteModal from '../../Helpers/DeleteModal';
import { MdClose, MdCheck, MdAdd } from 'react-icons/md';
import MDEditor from '@uiw/react-md-editor';
import InputRenderer from '../../Components/InputRenderer';
import { useBlueboardClient } from 'blueboard-client-react';
import { BlueboardProduct } from 'blueboard-client';
import Center from '../../Components/Center';
import Middleware from '../../Helpers/Middleware';
const Expand = ({ data }: { data: BlueboardProduct }): JSX.Element => {
    return (
        <div className="my-2 mx-2">
            <Row>
                <div className="col-auto">
                    <img src={data.imageUrl} height={200} alt="Product" />
                </div>

                <div className="col-auto">
                    <MDEditor.Markdown source={data.markdownContent} />
                    <InputRenderer inputs={data.inputs} />
                </div>
            </Row>
        </div>
    );
};

const Products = (): JSX.Element => {
    const theme = useTheme();
    const [products, setProducts] = React.useState<BlueboardProduct[]>([]);
    const [loading, setLoading] = React.useState(true);
    const history = useHistory();
    const client = useBlueboardClient();

    const bootstrap = async (): Promise<void> => {
        setLoading(true);
        client.products
            .all()
            .then((res) => {
                setProducts(res);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                toast.error(err.message);
            });
    };

    React.useEffect(() => {
        bootstrap();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const deleteRow = async (row: BlueboardProduct): Promise<void> => {
        const res = await deleteModal(
            'Biztos, hogy törölni szeretnéd ezt a terméket?',
            `Törlés - ${row.name}`,
            theme,
        );

        if (res.isConfirmed) {
            toast.promise(
                client.products.delete(row.id as number).then(() => bootstrap()),
                {
                    loading: 'Törlés...',
                    success: 'Sikeresen törölve!',
                    error: 'Hiba történt!',
                },
            );
        }
    };

    const editEl = async (id: number): Promise<void> => {
        history.push(`/admin/products/edit/${id}`);
    };

    const columns = [
        {
            name: 'ID',
            selector: (row: BlueboardProduct) => row.id,
            maxWidth: '10px',
        },
        {
            name: 'Név',
            selector: (row: BlueboardProduct) => row.name,
        },
        {
            name: 'Rövid leírás',
            selector: (row: BlueboardProduct) => row.description,
            wrap: true,
        },
        {
            name: 'Kód kell?',
            cell: (row: BlueboardProduct) => {
                return row.codeActivated ? <MdCheck fontSize={20} /> : <MdClose fontSize={20} />;
            },
            maxWidth: '10px',
        },
        {
            name: 'Látható a bazárban?',
            cell: (row: BlueboardProduct) => {
                return row.visible ? <MdCheck fontSize={20} /> : <MdClose fontSize={20} />;
            },
        },
        {
            name: 'Ár (LoLó)',
            selector: (row: BlueboardProduct) => row.price,
            maxWidth: '10px',
        },
        {
            name: 'Mennyiség',
            selector: (row: BlueboardProduct) => row.quantity,
            maxWidth: '10px',
        },
        {
            name: 'Aktiváló kódok',
            cell: (row: BlueboardProduct) => (
                <div>
                    {row.codes?.length === 0 ? (
                        <i>Itt nincs semmi.</i>
                    ) : (
                        row.codes?.map((el, key) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <Badge pill={true} key={key} className="badge-white m-1">
                                {el.name}
                            </Badge>
                        ))
                    )}
                </div>
            ),
            wrap: true,
        },
        {
            name: '',
            cell: (el: BlueboardProduct) => {
                return (
                    <>
                        <Middleware
                            permission="Products.update"
                            displayError={false}
                            component={
                                <Button
                                    className="mx-1"
                                    auto={true}
                                    rounded={true}
                                    color="primary"
                                    onClick={() => editEl(el.id as number)}>
                                    Szerkesztés
                                </Button>
                            }
                        />
                        <Middleware
                            permission="Products.delete"
                            displayError={false}
                            component={
                                <Button
                                    className="mx-1"
                                    auto={true}
                                    rounded={true}
                                    color="error"
                                    onClick={() => deleteRow(el)}>
                                    Törlés
                                </Button>
                            }
                        />
                    </>
                );
            },
        },
    ];

    return (
        <AuthLayout>
            <HeaderCard title="Termékek" />
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
                            <CardBody style={{ height: 'calc(100vh - 320px)' }}>
                                <DataTable
                                    highlightOnHover={true}
                                    pointerOnHover={true}
                                    columns={columns}
                                    data={products}
                                    theme={theme.type}
                                    progressPending={loading}
                                    progressComponent={<TableLoader />}
                                    noDataComponent={<EmptyTable />}
                                    expandableRows={true}
                                    expandOnRowClicked={true}
                                    fixedHeader={true}
                                    fixedHeaderScrollHeight="calc(100vh - 350px)"
                                    expandableRowsComponent={Expand}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                    <div className="mt-2" />
                    <Center>
                        <Middleware
                            permission="Products.create"
                            displayError={false}
                            component={
                                <Button
                                    color="gradient"
                                    rounded={true}
                                    onClick={() => history.push('/admin/products/edit/new')}>
                                    <MdAdd />
                                    Termék hozzáadása
                                </Button>
                            }
                        />
                    </Center>
                </Row>
            </Container>
        </AuthLayout>
    );
};

export default Products;
