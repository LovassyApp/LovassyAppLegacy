import { AuthorizedWrapper } from "../../components/authorizedWrapper";
import { NormalLayout } from "./normalLayout";
import { Outlet } from "react-router-dom";
import { ProtectedLayout } from "./protectedLayout";

export const LayoutDecider = (): JSX.Element => {
    return (
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
    );
};
