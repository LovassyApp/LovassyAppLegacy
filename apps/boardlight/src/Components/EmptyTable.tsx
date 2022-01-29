import React from 'react';

const EmptyTable = (): JSX.Element => {
    return (
        <>
            <blockquote className="blockquote">
                <p className="mb-4">Keresek én, de nem találok...</p>
                <footer className="blockquote-footer">
                    minigyima, <cite>2021</cite>
                </footer>
            </blockquote>
        </>
    );
};

export default EmptyTable;
