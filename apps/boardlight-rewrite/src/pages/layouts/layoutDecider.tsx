import { AuthorizedWrapper } from "../../components/authorizedWrapper";
import { NormalLayout } from "./normalLayout";
import { ProtectedLayout } from "./protectedLayout";

export const LayoutDecider = ({ children }: { children: React.ReactNode }): JSX.Element => {
    return (
        <AuthorizedWrapper fallback={<NormalLayout>{children}</NormalLayout>}>
            <ProtectedLayout>{children}</ProtectedLayout>
        </AuthorizedWrapper>
    );
};
