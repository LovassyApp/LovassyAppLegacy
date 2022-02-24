import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "../pages/protected/home";
import { Kreta } from "../pages/protected/kreta";

export const Router = (): JSX.Element => {
    return (
        <Routes>
            {/* -----Public Routes-----*/}
            <Route path="/" element={<Navigate to="/home" />} />

            {/* -----Protected Routes-----*/}
            <Route path="/home" element={<Home />} />
            <Route path="/kreta" element={<Kreta />} />
        </Routes>
    );
};
