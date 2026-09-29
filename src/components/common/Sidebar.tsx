import Dashboard from "@mui/icons-material/Dashboard";
import Pets from "@mui/icons-material/Pets";
import People from "@mui/icons-material/People";
import MedicalServices from "@mui/icons-material/MedicalServices";
import Business from "@mui/icons-material/Business";
import Event from "@mui/icons-material/Event";
import AccessTime from "@mui/icons-material/AccessTime";
import Category from "@mui/icons-material/Category";
import MeetingRoom from "@mui/icons-material/MeetingRoom";
import Schedule from "@mui/icons-material/Schedule";

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
        label: "Species",
        path: "/species",
        icon: <Category />,
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
        label: "Rooms",
        path: "/rooms",
        icon: <MeetingRoom />,
    },
    {
        label: "Room types",
        path: "/room-types",
        icon: <Category />,
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
    {
        label: "Medical records",
        path: "/medical-records",
        icon: <MedicalServices />,
    },
    {
        label: "Duration templates",
        path: "/duration-templates",
        icon: <Schedule />,
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
                            sx={{
                                "&.active": {
                                    bgcolor: "action.selected",
                                    color: "primary.main",
                                    "& .MuiListItemIcon-root": { color: "primary.main" },
                                },
                            }}
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
