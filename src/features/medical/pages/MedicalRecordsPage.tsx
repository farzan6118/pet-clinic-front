import { Alert, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPets } from "../../pet/api/petApi";
import { getMedicalRecordByPet } from "../api/medicalRecordApi";

export function MedicalRecordsPage() {
    const [petUuid, setPetUuid] = useState("");
    const pets = useQuery({ queryKey: ["pet-options"], queryFn: () => getPets({ pageNumber: 0, pageSize: 100 }) });
    const record = useQuery({ queryKey: ["medical-record", petUuid], queryFn: () => getMedicalRecordByPet(petUuid), enabled: Boolean(petUuid), retry: false });
    const item = record.data;

    return <Stack spacing={2}>
        <Typography variant="h4">Medical records</Typography>
        <TextField select label="Pet" value={petUuid} onChange={(event) => setPetUuid(event.target.value)} sx={{ maxWidth: 420 }}>
            {pets.data?.content.map((pet) => <MenuItem key={pet.uuid} value={pet.uuid}>{pet.name} ({pet.species})</MenuItem>)}
        </TextField>
        {record.isError && <Alert severity="info">No medical record is available for this pet yet.</Alert>}
        {item && <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>{item.petName} — {item.title ?? item.type}</Typography>
            <Stack spacing={1}>
                <Typography><b>Diagnosis:</b> {item.diagnosis ?? "—"}</Typography>
                <Typography><b>Clinical notes:</b> {item.clinicalNotes ?? "—"}</Typography>
                <Typography><b>Treatment plan:</b> {item.treatmentPlan ?? "—"}</Typography>
                <Typography><b>Prescription:</b> {item.prescription ?? "—"}</Typography>
                <Typography><b>Follow-up:</b> {item.followUpRequired ? item.followUpDate ?? "Required" : "Not required"}</Typography>
                <Typography><b>Vaccination:</b> {item.vaccinationDetails ?? "—"}</Typography>
                <Typography><b>Surgery:</b> {item.surgeryDetails ?? "—"}</Typography>
                <Typography color="text.secondary">Recorded {new Date(item.createdDate).toLocaleString()}</Typography>
            </Stack>
        </Paper>}
    </Stack>;
}
