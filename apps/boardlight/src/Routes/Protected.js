import Protected from '../Pages/Protected';
import React from 'react';
import NewHome from '../Pages/NewHome';
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

const protectedRoutes = [
    //{ path: '/test', component: <Protected />, exact: true },
    {
        path: '/home',
        component: <Middleware permission="General.home" displayError={true} component={<NewHome />} />,
        exact: true,
    },
    { path: '/grades', component: <Grades />, exact: true },
    { path: '/store', component: <Store />, exact: true },
    { path: '/admin/users', component: <Users />, exact: true },
    { path: '/admin/users/edit/:id', component: <EditUser />, exact: false },
    { path: '/admin/permissions', component: <Permissions />, exact: true },
    { path: '/admin/permissions/edit/:id', component: <EditGroup />, exact: false },
    { path: '/admin/qrcodes', component: <QRCodes />, exact: true },
    { path: '/admin/products', component: <Products />, exact: true },
    { path: '/admin/products/edit/:id', component: <EditProduct />, exact: false },
];

export default protectedRoutes;
