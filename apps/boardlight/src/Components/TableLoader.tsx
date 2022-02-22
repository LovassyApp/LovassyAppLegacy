import React from "react";
import {Loading} from "@nextui-org/react";

const TableLoader = (): JSX.Element => {
    return (
        <div className="py-5">
            <Loading color="primary" size="large" />
        </div>
    );
};

export default TableLoader;
