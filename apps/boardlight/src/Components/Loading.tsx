/* https://github.com/shamin/react-fullscreen-loading */
// Minimal portion, though

const Loading = (): JSX.Element => {
    return (
        <div className="loading-background" style={{background: "transparent"}}>
            <div className="loading-bar">
                <div className="loading-circle-1" style={{background: "whitesmoke"}} />
                <div className="loading-circle-2" style={{background: "whitesmoke"}} />
            </div>
        </div>
    );
};

export default Loading;
