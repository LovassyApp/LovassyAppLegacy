import { RootState } from "../../store/store";
import { useSelector } from "react-redux";

export const AuthorizedWrapper = ({
    fallback,
    children,
}: {
    fallback: JSX.Element;
    children: React.ReactNode;
}): JSX.Element => {
    const token = useSelector((state: RootState) => state.token.value);

    return token ? <>{children}</> : fallback;
};
