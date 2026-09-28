import { ThemeProvider } from "@mui/material/styles";
import { QueryProvider } from "./QueryProvider";
import { theme } from "../theme/theme";
import type { ReactNode } from "react";

interface AppProvidersProps {
    children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
    return (
        <ThemeProvider theme={theme}>
            <QueryProvider>
                {children}
            </QueryProvider>
        </ThemeProvider>
    );
}