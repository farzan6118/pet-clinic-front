import { Box, Toolbar } from "@mui/material";
import type { ReactNode } from "react";
import { Sidebar } from "../components/common/Sidebar";

interface AdminLayoutProps {
    children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />

            <Box component="main" sx={{ flexGrow: 1 }}>
                <Toolbar />

                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}