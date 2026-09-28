import {
    Dashboard,
    Pets,
    People,
    MedicalServices,
    Business,
    Event,
    AccessTime,
} from "@mui/icons-material";

import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Box,
} from "@mui/material";

import { NavLink } from "react-router-dom";

const drawerWidth = 240;

const menuItems = [
    {
        label: "Dashboard",
        path: "/dashboard",
        icon: <Dashboard />,
    },
    {
        label: "Owners",
        path: "/owners",
        icon: <People />,
    },
    {
        label: "Pets",
        path: "/pets",
        icon: <Pets />,
    },
    {
        label: "Vets",
        path: "/vets",
        icon: <MedicalServices />,
    },
    {
        label: "Clinics",
        path: "/clinics",
        icon: <Business />,
    },
    {
        label: "Visits",
        path: "/visits",
        icon: <Event />,
    },
    {
        label: "Availability",
        path: "/availability",
        icon: <AccessTime />,
    },
];

export function Sidebar() {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                },
            }}
        >
            <Toolbar>
                <Typography variant="h6">
                    Veterinary Clinic
                </Typography>
            </Toolbar>

            <Box sx={{ overflow: "auto" }}>
                <List>
                    {menuItems.map((item) => (
                        <ListItemButton
                            key={item.path}
                            component={NavLink}
                            to={item.path}
                        >
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>

                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
}