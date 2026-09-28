import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import { AdminLayout } from "../../layouts/AdminLayout";
import { DashboardPage } from "../../features/dashboard/pages/DashboardPage";

export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <AdminLayout>
                            <DashboardPage />
                        </AdminLayout>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}