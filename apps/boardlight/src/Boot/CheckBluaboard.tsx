import React from 'react';
import Loading from '../Components/Loading';

const CheckBlueboard = ({ children }: { children: React.ReactNode }): JSX.Element => {
    const [loading, setLoading] = React.useState(true);

    return <>{loading ? <Loading /> : children}</>;
};

export default CheckBlueboard;
