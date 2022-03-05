import { AppBootstrapProvider } from "../../boot/appBootstrapProvider";
import { AuthorizedWrapper } from "../../components/authorizedWrapper";
import { NormalLayout } from "./normalLayout";
import { Outlet } from "react-router-dom";
import { ProtectedLayout } from "./protectedLayout";

export const LayoutDecider = (): JSX.Element => {
    return (
        <AppBootstrapProvider>
            <AuthorizedWrapper
                fallback={
                    <NormalLayout>
                        <Outlet />
                    </NormalLayout>
                }>
                <ProtectedLayout>
                    <Outlet />
                </ProtectedLayout>
            </AuthorizedWrapper>
        </AppBootstrapProvider>
    );
};
