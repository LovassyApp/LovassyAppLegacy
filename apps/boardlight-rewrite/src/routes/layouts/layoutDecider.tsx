import { AppBootstrapProvider } from "../../boot/appBootstrapProvider";
import { AuthorizedWrapper } from "../../components/util/authorizedWrapper";
import { CommandPalette } from "../../components/content/commandPalette";
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
                <CommandPalette>
                    <ProtectedLayout>
                        <Outlet />
                    </ProtectedLayout>
                </CommandPalette>
            </AuthorizedWrapper>
        </AppBootstrapProvider>
    );
};
