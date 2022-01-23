import * as React from 'react';
import HeaderCard from '../Components/HeaderCard';
import EmptyTable from '../Components/EmptyTable';
import AuthLayout from '../Layouts/Auth';
import Middleware from '../Helpers/Middleware';
import { Collapse, useTheme, Text } from '@nextui-org/react';
import GradeCard from '../Components/GradeCard';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useBlueboardClient, useBlueboardPrivateChannel } from 'blueboard-client-react';
import TableLoader from '../Components/TableLoader';
import { Container } from 'reactstrap';

const Grades = () => {
    const client = useBlueboardClient();
    const [loading, setLoading] = React.useState(true);
    const [grades, setGrades] = React.useState([]);

    React.useEffect(() => {
        client.kreta.grades(true).then((res) => {
            console.log(res);
            //console.log('fetch');
            setGrades(res);
            setLoading(false);
        });
    }, []);

    return (
        <AuthLayout>
            <HeaderCard title="Jegyek" />
            {loading ? (
                <center>
                    <TableLoader />
                </center>
            ) : (
                <>
                    {grades.length === 0 ? (
                        <center>
                            <div className="mt-4">
                                <EmptyTable />
                            </div>
                        </center>
                    ) : (
                        <Container fluid style={{ width: '95%' }}>
                            <Collapse.Group>
                                {grades.map((value, key) => (
                                    <Collapse
                                        style={{ display: 'block' }}
                                        key={key}
                                        title={<Text h4>{value.subject}</Text>}
                                    >
                                        asd
                                    </Collapse>
                                ))}
                            </Collapse.Group>
                        </Container>
                    )}
                </>
            )}
        </AuthLayout>
    );
};

export default Grades;
