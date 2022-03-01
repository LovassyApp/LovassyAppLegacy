import { Route, Redirect, Switch } from 'react-router-dom';
import ProtectedRoutes from './Protected';
import NormalRoutes from './Normal';
import Four0Four from '../Pages/404';
import React from 'react';
import useToken from '../Hooks/useToken';
import { useControl } from '../Hooks/ControlHooks';

const Routes = (): JSX.Element => {
    const token = useToken();
    const control = useControl();

    const canAuthAccess = Object.keys(control).length !== 0;

    const noAuthRedirect = '/login';
    const authRedirect = '/home';

    let i = 0;

    return (
        <Switch>
            {NormalRoutes.map((el) => (
                <Route exact={el.exact} key={i} path={el.path}>
                    {i++ ? null : null}
                    {token !== null && el.noAuthOnly ? (
                        <Redirect
                            to={{
                                pathname: authRedirect,
                                state: { referrer: el.path, guest: true },
                            }}
                        />
                    ) : (
                        el.component
                    )}
                </Route>
            ))}

            {ProtectedRoutes.map((el) => (
                <Route key={i} exact={el.exact} path={el.path}>
                    {i++ ? null : null}
                    {canAuthAccess ? (
                        el.component
                    ) : (
                        <Redirect
                            to={{
                                pathname: noAuthRedirect,
                                state: { referrer: el.path, guest: false },
                            }}
                        />
                    )}
                </Route>
            ))}

            <Route path="*">
                <Four0Four />
            </Route>
        </Switch>
    );
};

export default Routes;
