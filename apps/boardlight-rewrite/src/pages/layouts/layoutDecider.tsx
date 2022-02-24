import { ProtectedLayout } from "./protectedLayout";
import { NormalLayout } from "./normalLayout";

export const LayoutDecider = ({ children }: { children: React.ReactNode }): JSX.Element => {
    return <ProtectedLayout>{children}</ProtectedLayout>;
};
