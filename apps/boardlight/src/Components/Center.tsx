import * as React from "react";

const Center = ({children}: {children: React.ReactNode}): JSX.Element => {
    const localStyles = {
        center: {
            textAlign: "center",
        } as React.CSSProperties,
        childDiv: {
            marginLeft: "auto",
            marginRight: "auto",
        } as React.CSSProperties,
    };

    return (
        <div style={localStyles.center}>
            <div style={localStyles.childDiv}>{children}</div>
        </div>
    );
};

export default Center;
