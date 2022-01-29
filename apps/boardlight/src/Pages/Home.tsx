import * as React from 'react';
import HeaderCard from '../Components/HeaderCard';
import EmptyTable from '../Components/EmptyTable';
import AuthLayout from '../Layouts/Auth';
//import { useTheme } from '@nextui-org/react';
//import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useBlueboardPrivateChannel } from 'blueboard-client-react';
import { useUser } from '../Hooks/ControlHooks';

const Home = () => {
    const user = useUser();

    useBlueboardPrivateChannel('App.Models.User.' + user.id, 'TestEvent', (data: any) => {
        toast(data.message);
    });

    return (
        <AuthLayout>
            <HeaderCard title="Szebbet jobbat!" />
            <div className="container">
                <div className="row">
                    <div className="col-sm mt-2">Nem</div>
                    <div className="col-sm mt-2">
                        <h1>MÁSIK </h1>
                    </div>
                </div>
                <EmptyTable />
            </div>
        </AuthLayout>
    );
};

export default Home;
