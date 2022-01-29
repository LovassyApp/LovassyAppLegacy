import Login from '../Pages/Login';
import React from 'react';
import { Redirect } from 'react-router';

export type Route = {
    path: string;
    component: React.ReactNode;
    exact: boolean;
    noAuthOnly: boolean;
};

const normalRoutes: Route[] = [
    { path: '/login', component: <Login />, exact: true, noAuthOnly: true },
    {
        path: '/',
        component: (
            <Redirect
                to={{
                    pathname: '/home',
                    state: { referrer: '/' },
                }}
            ></Redirect>
        ),
        exact: true,
        noAuthOnly: false,
    },
];

export default normalRoutes;
