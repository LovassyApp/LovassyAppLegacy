import BlueboardSocketProvider from "./BlueboardSocketProvider";
import BlueboardClientProvider from "./BlueboardClientProvider";
import providerProps from "../models/ProviderProps";

const BlueboardProvider = ({ token, children }: providerProps) => {
    return (
        <>
            <BlueboardClientProvider token={token}>
                <BlueboardSocketProvider token={token}>
                    {children}
                </BlueboardSocketProvider>
            </BlueboardClientProvider>
        </>
    );
};

export default BlueboardProvider;
