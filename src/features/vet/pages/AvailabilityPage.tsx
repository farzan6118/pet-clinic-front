import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Alert, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { ResourcePage } from "../../../components/common/ResourcePage";
import { formValuesFromRow, nestedPayload, type ResourceField } from "../../../lib/resourceForms";
import { getVetOptions } from "../api/vetApi";
import { createVetAvailability, deleteVetAvailability, getAvailabilitiesByDate, getVetAvailabilities, updateVetAvailability } from "../api/availabilityApi";
import type { VetAvailabilityRequest, VetAvailabilityResponse } from "../types/vet";
import { useQuery } from "@tanstack/react-query";

const fields: ResourceField[] = [
    { name: "startTime", label: "Starts at", type: "datetime-local", required: true },
    { name: "endTime", label: "Ends at", type: "datetime-local", required: true },
];

export function AvailabilityPage() {
    const [vetUuid, setVetUuid] = useState("");
    const [date, setDate] = useState("");
    const vets = useQuery({ queryKey: ["vet-options"], queryFn: getVetOptions });
    const dateQuery = useQuery({ queryKey: ["availabilities-by-date", date], queryFn: () => getAvailabilitiesByDate(date), enabled: Boolean(date) });

    return <Stack spacing={2}>
        <Typography variant="h4">Availability</Typography>
        <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField select label="Vet for schedule management" value={vetUuid} onChange={(event) => setVetUuid(event.target.value)} sx={{ minWidth: 280 }}>
                    {vets.data?.map((vet) => <MenuItem key={vet.uuid} value={vet.uuid}>{vet.title}</MenuItem>)}
                </TextField>
                <TextField type="date" label="Find availability by date" value={date} onChange={(event) => setDate(event.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
            </Stack>
        </Paper>
        {date && <>
            {dateQuery.isError && <Alert severity="error">{dateQuery.error.message}</Alert>}
            <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>All availability on {date}</Typography>
                {(dateQuery.data ?? []).map((item) => <Typography key={item.uuid}>{item.name}: {item.startTime}–{item.endTime} ({item.active ? "Active" : "Inactive"})</Typography>)}
                {!dateQuery.isLoading && !dateQuery.data?.length && <Typography color="text.secondary">No availability found for this date.</Typography>}
            </Paper>
        </>}
        {vetUuid ? <ResourcePage<VetAvailabilityResponse> key={vetUuid} config={{
            title: "Vet availability", queryKey: `availabilities-${vetUuid}`, fields,
            columns: [
                { label: "Vet", render: (row) => row.name },
                { label: "Date", render: (row) => row.date },
                { label: "From", render: (row) => row.startTime },
                { label: "To", render: (row) => row.endTime },
                { label: "Active", render: (row) => row.active ? "Yes" : "No" },
            ],
            load: async () => (await getVetAvailabilities(vetUuid, { pageNumber: 0, pageSize: 100 })).content,
            create: (data) => createVetAvailability(vetUuid, data as VetAvailabilityRequest),
            update: (uuid, data) => updateVetAvailability(vetUuid, uuid, data as VetAvailabilityRequest),
            remove: (uuid) => deleteVetAvailability(vetUuid, uuid),
            toPayload: (values) => ({ ...nestedPayload(values, fields), vetUuid }),
            toForm: (row) => formValuesFromRow({ ...row, startTime: `${row.date}T${row.startTime}`, endTime: `${row.date}T${row.endTime}` }, fields),
        }} /> : <Alert icon={<AccessTimeIcon />} severity="info">Choose a vet to create, edit, or remove schedule availability.</Alert>}
    </Stack>;
}
