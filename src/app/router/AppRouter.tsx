import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import { AdminLayout } from "../../layouts/AdminLayout";
import { DashboardPage } from "../../features/dashboard/pages/DashboardPage";
import { OwnerListPage } from "../../features/owner/pages/OwnerListPage";
import { PetsPage } from "../../features/pet/pages/PetsPage";
import { SpeciesPage } from "../../features/pet/pages/SpeciesPage";
import { VetsPage } from "../../features/vet/pages/VetsPage";
import { AvailabilityPage } from "../../features/vet/pages/AvailabilityPage";
import { ClinicsPage } from "../../features/clinic/pages/ClinicsPage";
import { RoomsPage } from "../../features/clinic/pages/RoomsPage";
import { RoomTypesPage } from "../../features/clinic/pages/RoomTypesPage";
import { VisitsPage } from "../../features/visit/pages/VisitsPage";
import { DurationTemplatesPage } from "../../features/visit/pages/DurationTemplatesPage";
import { MedicalRecordsPage } from "../../features/medical/pages/MedicalRecordsPage";

const pages = [
    { path: "/dashboard", component: <DashboardPage /> },
    { path: "/owners", component: <OwnerListPage /> },
    { path: "/pets", component: <PetsPage /> },
    { path: "/species", component: <SpeciesPage /> },
    { path: "/vets", component: <VetsPage /> },
    { path: "/clinics", component: <ClinicsPage /> },
    { path: "/rooms", component: <RoomsPage /> },
    { path: "/room-types", component: <RoomTypesPage /> },
    { path: "/visits", component: <VisitsPage /> },
    { path: "/availability", component: <AvailabilityPage /> },
    { path: "/medical-records", component: <MedicalRecordsPage /> },
    { path: "/duration-templates", component: <DurationTemplatesPage /> },
];

export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                />

                {pages.map(({ path, component }) => (
                    <Route key={path} path={path} element={<AdminLayout>{component}</AdminLayout>} />
                ))}
            </Routes>
        </BrowserRouter>
    );
}
