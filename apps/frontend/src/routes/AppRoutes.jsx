import { Routes,Route } from "react-router-dom";
import PrivateRoute from "./privateRouter";
import PublicRoute from "./publicRoute";


import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={
                <PublicRoute>
                    <Login />
                </PublicRoute>
            } />
            <Route path="/" element={
                <PrivateRoute>
                    <Dashboard />
                </PrivateRoute>
            } />
        </Routes>
    )
    
}
