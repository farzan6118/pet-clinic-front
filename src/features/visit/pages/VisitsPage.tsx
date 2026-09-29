import { Button, Stack } from "@mui/material";
import { createVisit, cancelVisit, completeVisit, getVisits, rescheduleVisit } from "../api/visitApi";
import type { CompleteVisitRequest, RescheduleVisitRequest, VisitRequest, VisitResponse, VisitType } from "../types/visit";
import { ResourcePage } from "../../../components/common/ResourcePage";
import { formValuesFromRow, nestedPayload, type ResourceField } from "../../../lib/resourceForms";
import { getPets } from "../../pet/api/petApi";
import { getVetOptions } from "../../vet/api/vetApi";

const fields: ResourceField[] = [
    { name: "petUuid", label: "Pet", type: "select", required: true, options: async () => (await getPets({ pageNumber: 0, pageSize: 100 })).content.map((pet) => ({ value: pet.uuid, label: `${pet.name} (${pet.species})` })) },
    { name: "vetUuid", label: "Vet", type: "select", required: true, options: async () => (await getVetOptions()).map(({ uuid, title }) => ({ value: uuid, label: title })) },
    { name: "visitDate", label: "Date", type: "date", required: true },
    { name: "visitTime", label: "Time", type: "time", required: true },
    { name: "visitType", label: "Visit type", type: "select", required: true, options: ["ONLINE", "ONSITE", "OFFSITE"].map((value) => ({ value, label: value })) },
    { name: "durationMinutes", label: "Duration in minutes", type: "number" },
    { name: "description", label: "Description" },
];

export function VisitsPage() {
    return <ResourcePage<VisitResponse> config={{
        title: "Visits", queryKey: "visits", fields,
        columns: [
            { label: "Pet", render: (row) => `${row.petName} (${row.species})` },
            { label: "Owner", render: (row) => row.ownerFullName },
            { label: "Vet", render: (row) => row.vetFullName },
            { label: "Starts", render: (row) => row.visitDateFrom.replace("T", " ").slice(0, 16) },
            { label: "Status", render: (row) => row.status },
        ],
        load: async () => (await getVisits({ pageNumber: 0, pageSize: 100 })).content,
        create: (data) => createVisit(data as VisitRequest),
        update: async () => { throw new Error("Use the reschedule action for visits."); },
        remove: async (uuid) => {
            const reason = window.prompt("Cancellation reason (optional):") ?? undefined;
            await cancelVisit(uuid, reason);
        },
        toPayload: (values) => nestedPayload(values, fields),
        toForm: (row) => formValuesFromRow({ ...row, visitDate: row.visitDateFrom.slice(0, 10), visitTime: row.visitDateFrom.slice(11, 16) }, fields),
        canEdit: false,
        canDelete: false,
        extraActions: (row, refresh) => <Stack direction="row" spacing={0.5} component="span">
            <Button size="small" onClick={() => {
                const date = window.prompt("New visit date (YYYY-MM-DD):", row.visitDateFrom.slice(0, 10));
                if (!date) return;
                const time = window.prompt("New visit time (HH:mm):", row.visitDateFrom.slice(11, 16));
                if (!time) return;
                const reason = window.prompt("Reschedule reason (optional):") ?? undefined;
                const request: RescheduleVisitRequest = { visitDate: date, visitTime: time, visitType: row.visitType as VisitType, reason };
                void rescheduleVisit(row.uuid, request).then(refresh).catch((error: unknown) => window.alert(error instanceof Error ? error.message : "Could not reschedule visit."));
            }}>Reschedule</Button>
            <Button size="small" onClick={() => {
                const diagnosis = window.prompt("Diagnosis:");
                if (!diagnosis) return;
                const request: CompleteVisitRequest = { diagnosis, followUpRequired: false };
                void completeVisit(row.uuid, request).then(refresh).catch((error: unknown) => window.alert(error instanceof Error ? error.message : "Could not complete visit."));
            }}>Complete</Button>
            <Button size="small" color="error" onClick={() => {
                if (!window.confirm("Cancel this visit?")) return;
                const reason = window.prompt("Cancellation reason (optional):");
                if (reason === null) return;
                void cancelVisit(row.uuid, reason || undefined).then(refresh).catch((error: unknown) => window.alert(error instanceof Error ? error.message : "Could not cancel visit."));
            }}>Cancel</Button>
        </Stack>,
    }} />;
}
