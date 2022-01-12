import * as React from 'react';
import HeaderCard from '../Components/HeaderCard';
import EmptyTable from '../Components/EmptyTable';
import AuthLayout from '../Layouts/Auth';
import Middleware from '../Helpers/Middleware';
import { useTheme } from '@nextui-org/react';
import GradeCard from '../Components/GradeCard';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useBlueboardPrivateChannel } from 'blueboard-client-react';

const NewHome = () => {
    const theme = useTheme();

    const user = useSelector((state) => state.control.control.user);

    useBlueboardPrivateChannel('App.Models.User.' + user.id, 'TestEvent', (data) => {
        toast(data.message);
    });

    return (
        <AuthLayout>
            <HeaderCard title="Szebbet jobbat!" />
            <div className="container">
                <div className="row">
                    <div className="col-sm mt-2">
                        <GradeCard />
                    </div>
                    <div className="col-sm mt-2">
                        <h1>MÁSIK </h1>
                    </div>
                </div>
                <EmptyTable />
            </div>
        </AuthLayout>
    );
};

export default NewHome;
