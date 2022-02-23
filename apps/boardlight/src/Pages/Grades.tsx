import * as React from "react";
import HeaderCard from "../Components/HeaderCard";
import EmptyTable from "../Components/EmptyTable";
import AuthLayout from "../Layouts/Auth";
import { Collapse, Text /* Card, Button*/ } from "@nextui-org/react";
import GradeCard from "../Components/GradeCard";
// import toast from 'react-hot-toast';
import { useBlueboardClient } from "blueboard-client-react";
import TableLoader from "../Components/TableLoader";
import { Col, Container, Row /* Badge*/ } from "reactstrap";
import Center from "../Components/Center";
import { BlueboardKretaGradeData } from "blueboard-client";
import toast from "react-hot-toast";

const Grades = (): JSX.Element => {
    const client = useBlueboardClient();
    const [loading, setLoading] = React.useState(true);
    const [grades, setGrades] = React.useState<BlueboardKretaGradeData[]>([]);

    React.useEffect(() => {
        client.kreta
            .grades(true)
            .then((res) => {
                // console.log(res);
                // console.log('fetch');
                setGrades(res);
                setLoading(false);
            })
            .catch((err) => {
                toast.error(`ERROR! - ${err.message}`);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AuthLayout>
            <HeaderCard title="Jegyek" />
            {loading ? (
                <Center>
                    <TableLoader />
                </Center>
            ) : (
                <>
                    {grades.length === 0 ? (
                        <Center>
                            <div className="mt-4">
                                <EmptyTable />
                            </div>
                        </Center>
                    ) : (
                        <>
                            {/* <Container fluid style={{ width: '95%' }}>
                                <Card hoverable>
                                    <Row>
                                        <Col md="4" sm="12">
                                            <Text className="mt-2">
                                                Átlag:{' '}
                                                <Badge pill color="success">
                                                    5.00
                                                </Badge>{' '}
                                                Osztályátlag:{' '}
                                                <Badge pill color="success">
                                                    5.00
                                                </Badge>
                                            </Text>
                                        </Col>
                                        <Col md="4" sm="0"></Col>
                                        <Col md="4" sm="12">
                                            <Button rounded auto className="float-end" color="gradient">
                                                Frissítés
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card>
                            </Container>*/}
                            <Container fluid={true} style={{ width: "95%" }}>
                                <Collapse.Group>
                                    {grades.map((value, key) => (
                                        <Collapse
                                            style={{ display: "block" }}
                                            // eslint-disable-next-line react/no-array-index-key
                                            key={key}
                                            title={<Text h4={true}>{value.subject}</Text>}>
                                            <Row className="ms-3 me-1 my-4">
                                                {value.grades.map((el) => (
                                                    <Col
                                                        xl={6}
                                                        md={12}
                                                        className="mb-3"
                                                        key={el.id}>
                                                        <GradeCard grade={el} />
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Collapse>
                                    ))}
                                </Collapse.Group>
                            </Container>
                        </>
                    )}
                </>
            )}
        </AuthLayout>
    );
};

export default Grades;
