import React from 'react';
import Home from '../Pages/Home';
import Users from '../Pages/Admin/Users';
import Permissions from '../Pages/Admin/Groups';
import EditGroup from '../Pages/Admin/EditGroup';
import EditUser from '../Pages/Admin/EditUser';
import QRCodes from '../Pages/Admin/QRCodes';
import Middleware from '../Helpers/Middleware';
import Products from '../Pages/Admin/Products';
import EditProduct from '../Pages/Admin/EditProduct';
import Store from '../Pages/Store';
import Grades from '../Pages/Grades';
import Lolo from '../Pages/Lolo';
import Inventory from '../Pages/Inventory';
import Requests from '../Pages/Admin/Requests';

export interface ProtectedRoute {
    path: string;
    component: React.ReactNode;
    exact: boolean;
}

const protectedRoutes: ProtectedRoute[] = [
    // { path: '/test', component: <Protected />, exact: true },
    // User routes
    {
        path: '/home',
        component: (
            <Middleware permission="General.home" displayError={true} component={<Home />} />
        ),
        exact: true,
    },

    {
        path: '/grades',
        component: (
            <Middleware permission="General.grades" displayError={true} component={<Grades />} />
        ),
        exact: true,
    },

    {
        path: '/lolo',
        component: (
            <Middleware permission="General.lolo" displayError={true} component={<Lolo />} />
        ),
        exact: true,
    },

    {
        path: '/store',
        component: <Middleware permission="Store.view" displayError={true} component={<Store />} />,
        exact: true,
    },

    {
        path: '/inventory',
        component: (
            <Middleware permission="Inventory.view" displayError={true} component={<Inventory />} />
        ),
        exact: true,
    },

    // Admin stuff
    {
        path: '/admin/users',
        component: <Middleware permission="Users.view" displayError={true} component={<Users />} />,
        exact: true,
    },
    {
        path: '/admin/users/edit/:id',
        component: (
            <Middleware permission="Users.update" displayError={true} component={<EditUser />} />
        ),
        exact: false,
    },

    {
        path: '/admin/permissions',
        component: (
            <Middleware
                permission="Permissions.view"
                displayError={true}
                component={<Permissions />}
            />
        ),
        exact: true,
    },
    { path: '/admin/permissions/edit/:id', component: <EditGroup />, exact: false },

    {
        path: '/admin/qrcodes',
        component: (
            <Middleware permission="QRCode.view" displayError={true} component={<QRCodes />} />
        ),
        exact: true,
    },

    {
        path: '/admin/requests',
        component: (
            <Middleware permission="Requests.index" displayError={true} component={<Requests />} />
        ),
        exact: true,
    },

    {
        path: '/admin/products',
        component: (
            <Middleware permission="Products.index" displayError={true} component={<Products />} />
        ),
        exact: true,
    },
    { path: '/admin/products/edit/:id', component: <EditProduct />, exact: false },
];

export default protectedRoutes;
