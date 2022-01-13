import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'reactstrap';
//import { logout } from '../Helpers/Auth';

const Protected = () => {
    const dispatch = useDispatch();
    return (
        <div>
            <h1>Logged in!</h1>
            <Button color="danger" onClick={() => alert('nope')}>
                Log out
            </Button>
        </div>
    );
};

export default Protected;
