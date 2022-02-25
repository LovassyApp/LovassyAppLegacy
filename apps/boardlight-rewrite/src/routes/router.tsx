import { Navigate, Route, Routes } from "react-router-dom";

import { AuthorizedWrapper } from "../components/authorizedWrapper";
import { Home } from "../pages/protected/home";
import { Kreta } from "../pages/protected/kreta";
import { Login } from "../pages/normal/login";

export const Router = (): JSX.Element => {
    return (
        <Routes>
            {/* -----Public Routes-----*/}
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/login" element={<Login />} />

            {/* -----Protected Routes-----*/}
            <Route
                path="/home"
                element={
                    <AuthorizedWrapper fallback={<Navigate to="/login" />}>
                        <Home />
                    </AuthorizedWrapper>
                }
            />
            <Route
                path="/kreta"
                element={
                    <AuthorizedWrapper fallback={<Navigate to="/login" />}>
                        <Kreta />
                    </AuthorizedWrapper>
                }
            />
        </Routes>
    );
};
