import { Navigate, Route, Routes } from "react-router-dom";

import { AuthorizedWrapper } from "../components/util/authorizedWrapper";
import { Four0Four } from "../pages/error/four0Four";
import { Home } from "../pages/protected/home";
import { Kreta } from "../pages/protected/kreta";
import { LayoutDecider } from "./layouts/layoutDecider";
import { Login } from "../pages/normal/login";

export const Router = (): JSX.Element => {
    return (
        <Routes>
            {/* -----Public Routes-----*/}
            <Route path="*" element={<Four0Four />} />
            <Route path="/" element={<LayoutDecider />}>
                <Route path="login" element={<Login />} />
                <Route index={true} element={<Navigate to="/home" />} />

                {/* -----Protected Routes-----*/}
                <Route
                    path="home"
                    element={
                        <AuthorizedWrapper fallback={<Navigate to="/login" />}>
                            <Home />
                        </AuthorizedWrapper>
                    }
                />
                <Route
                    path="kreta"
                    element={
                        <AuthorizedWrapper fallback={<Navigate to="/login" />}>
                            <Kreta />
                        </AuthorizedWrapper>
                    }
                />
            </Route>
        </Routes>
    );
};
