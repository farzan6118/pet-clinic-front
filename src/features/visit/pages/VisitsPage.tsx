import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ResourcePage } from "../../../components/common/ResourcePage";
import { DateTimePickerField } from "../../../components/common/DateTimePickerField";
import { getPets } from "../../pet/api/petApi";
import { getVetOptions } from "../../vet/api/vetApi";
import { getDurationTemplates } from "../api/durationTemplateApi";
import { cancelVisit, completeVisit, createVisit, getAvailableVisitSlots, getVisits, rescheduleVisit } from "../api/visitApi";
import type {
    AvailableVisitSlotResponse,
    CompleteVisitRequest,
    RescheduleVisitRequest,
    VisitRequest,
    VisitResponse,
    VisitType,
} from "../types/visit";

const visitTypes: VisitType[] = ["ONSITE", "ONLINE", "OFFSITE"];

function todayAsIsoDate(): string {
    const today = new Date();
    const pad = (value: number) => String(value).padStart(2, "0");
    return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
}

function addDays(date: string, days: number): string {
    const [year, month, day] = date.split("-").map(Number);
    const result = new Date(year, month - 1, day + days);
    const pad = (value: number) => String(value).padStart(2, "0");
    return `${result.getFullYear()}-${pad(result.getMonth() + 1)}-${pad(result.getDate())}`;
}

function formatDay(date: string): string {
    const [year, month, day] = date.split("-").map(Number);
    return new Intl.DateTimeFormat(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
    }).format(new Date(year, month - 1, day, 12));
}

export function VisitsPage() {
    const queryClient = useQueryClient();
    const [bookingOpen, setBookingOpen] = useState(false);
    const [bookingVetUuid, setBookingVetUuid] = useState("");
    const [bookingPetUuid, setBookingPetUuid] = useState("");
    const [bookingVisitType, setBookingVisitType] = useState<VisitType>("ONSITE");
    const [bookingDuration, setBookingDuration] = useState("");
    const [bookingDescription, setBookingDescription] = useState("");
    const [bookingDateFrom, setBookingDateFrom] = useState("");
    const [selectedSlotKey, setSelectedSlotKey] = useState("");
    const [bookingError, setBookingError] = useState("");
    const [bookingBusy, setBookingBusy] = useState(false);

    const [rescheduling, setRescheduling] = useState<VisitResponse | null>(null);
    const [rescheduleDate, setRescheduleDate] = useState("");
    const [rescheduleTime, setRescheduleTime] = useState("");
    const [rescheduleReason, setRescheduleReason] = useState("");
    const [rescheduleError, setRescheduleError] = useState("");
    const [reschedulingBusy, setReschedulingBusy] = useState(false);

    const petsQuery = useQuery({
        queryKey: ["visit-booking-pets"],
        queryFn: () => getPets({ pageNumber: 0, pageSize: 100 }),
        enabled: bookingOpen,
    });
    const vetsQuery = useQuery({
        queryKey: ["visit-booking-vets"],
        queryFn: getVetOptions,
        enabled: bookingOpen,
    });
    const durationQuery = useQuery({
        queryKey: ["visit-booking-durations"],
        queryFn: () => getDurationTemplates({ pageNumber: 0, pageSize: 100 }),
        enabled: bookingOpen,
    });

    const defaultDuration = durationQuery.data?.content.find((item) => item.durationMinutes === 15)
        ?? durationQuery.data?.content[0];
    const selectedDuration = bookingDuration || String(defaultDuration?.durationMinutes ?? "");
    const bookingDateTo = bookingDateFrom ? addDays(bookingDateFrom, 30) : "";
    const slotsQuery = useQuery({
        queryKey: ["available-visit-slots", bookingVetUuid, bookingPetUuid, bookingVisitType, selectedDuration, bookingDateFrom],
        queryFn: () => getAvailableVisitSlots({
            vetUuid: bookingVetUuid,
            petUuid: bookingPetUuid,
            dateFrom: bookingDateFrom,
            dateTo: bookingDateTo,
            visitType: bookingVisitType,
            durationMinutes: Number(selectedDuration),
            intervalMinutes: 15,
        }),
        enabled: bookingOpen && Boolean(bookingVetUuid && bookingPetUuid && selectedDuration && bookingDateFrom),
        staleTime: 30_000,
    });

    const selectedSlot = slotsQuery.data?.find((slot) => slot.visitDateFrom === selectedSlotKey);
    const slotsByDay = (slotsQuery.data ?? []).reduce<Map<string, AvailableVisitSlotResponse[]>>((groups, slot) => {
        const date = slot.visitDateFrom.slice(0, 10);
        groups.set(date, [...(groups.get(date) ?? []), slot]);
        return groups;
    }, new Map());

    const openBooking = () => {
        setBookingVetUuid("");
        setBookingPetUuid("");
        setBookingVisitType("ONSITE");
        setBookingDuration("");
        setBookingDescription("");
        setBookingDateFrom(todayAsIsoDate());
        setSelectedSlotKey("");
        setBookingError("");
        setBookingOpen(true);
    };

    const submitBooking = async () => {
        if (!selectedSlot) return;
        setBookingBusy(true);
        setBookingError("");
        const request: VisitRequest = {
            petUuid: bookingPetUuid,
            vetUuid: bookingVetUuid,
            visitDate: selectedSlot.visitDateFrom.slice(0, 10),
            visitTime: selectedSlot.visitDateFrom.slice(11, 16),
            visitType: bookingVisitType,
            durationMinutes: Number(selectedDuration),
            description: bookingDescription || undefined,
        };
        try {
            await createVisit(request);
            await queryClient.invalidateQueries({ queryKey: ["visits"] });
            await slotsQuery.refetch();
            setSelectedSlotKey("");
            setBookingOpen(false);
        } catch (error) {
            setBookingError(error instanceof Error ? error.message : "Could not book this visit.");
            await slotsQuery.refetch();
            setSelectedSlotKey("");
        } finally {
            setBookingBusy(false);
        }
    };

    const submitReschedule = async () => {
        if (!rescheduling) return;
        setReschedulingBusy(true);
        setRescheduleError("");
        try {
            const request: RescheduleVisitRequest = {
                visitDate: rescheduleDate,
                visitTime: rescheduleTime,
                visitType: rescheduling.visitType,
                reason: rescheduleReason || undefined,
            };
            await rescheduleVisit(rescheduling.uuid, request);
            await queryClient.invalidateQueries({ queryKey: ["visits"] });
            setRescheduling(null);
        } catch (error) {
            setRescheduleError(error instanceof Error ? error.message : "Could not reschedule visit.");
        } finally {
            setReschedulingBusy(false);
        }
    };

    return <>
        <ResourcePage<VisitResponse> config={{
            title: "Visits",
            queryKey: "visits",
            fields: [],
            columns: [
                { label: "Pet", render: (row) => `${row.petName} (${row.species})` },
                { label: "Owner", render: (row) => row.ownerFullName },
                { label: "Vet", render: (row) => row.vetFullName },
                { label: "Starts", render: (row) => row.visitDateFrom.replace("T", " ").slice(0, 16) },
                { label: "Status", render: (row) => row.status },
            ],
            load: async () => (await getVisits({ pageNumber: 0, pageSize: 100 })).content,
            create: async () => undefined,
            update: async () => { throw new Error("Use the reschedule action for visits."); },
            remove: async (uuid) => {
                const reason = window.prompt("Cancellation reason (optional):") ?? undefined;
                await cancelVisit(uuid, reason);
            },
            toPayload: (values) => values,
            canCreate: false,
            createAction: <Button variant="contained" onClick={openBooking}>Book visit</Button>,
            canEdit: false,
            canDelete: false,
            extraActions: (row, refresh) => <Stack direction="row" spacing={0.5} component="span">
                <Button size="small" onClick={() => {
                    setRescheduling(row);
                    setRescheduleDate(row.visitDateFrom.slice(0, 10));
                    setRescheduleTime(row.visitDateFrom.slice(11, 16));
                    setRescheduleReason("");
                    setRescheduleError("");
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
        }} />

        <Dialog open={bookingOpen} onClose={() => !bookingBusy && setBookingOpen(false)} fullWidth maxWidth="md">
            <DialogTitle>Book a visit</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ pt: 1 }}>
                    {bookingError && <Alert severity="error">{bookingError}</Alert>}
                    {(petsQuery.isError || vetsQuery.isError || durationQuery.isError) &&
                        <Alert severity="error">Could not load the booking options. Please retry.</Alert>}
                    <TextField select fullWidth label="Veterinarian" value={bookingVetUuid}
                        onChange={(event) => { setBookingVetUuid(event.target.value); setSelectedSlotKey(""); }}
                        disabled={vetsQuery.isLoading} required>
                        {(vetsQuery.data ?? []).map((vet) => <MenuItem key={vet.uuid} value={vet.uuid}>{vet.title}</MenuItem>)}
                    </TextField>
                    <TextField select fullWidth label="Pet" value={bookingPetUuid}
                        onChange={(event) => { setBookingPetUuid(event.target.value); setSelectedSlotKey(""); }}
                        disabled={petsQuery.isLoading} required>
                        {(petsQuery.data?.content ?? []).map((pet) => <MenuItem key={pet.uuid} value={pet.uuid}>{pet.name} ({pet.species})</MenuItem>)}
                    </TextField>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <TextField select fullWidth label="Visit type" value={bookingVisitType}
                            onChange={(event) => { setBookingVisitType(event.target.value as VisitType); setSelectedSlotKey(""); }}>
                            {visitTypes.map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                        </TextField>
                        <TextField select fullWidth label="Duration" value={selectedDuration}
                            onChange={(event) => { setBookingDuration(event.target.value); setSelectedSlotKey(""); }}
                            disabled={durationQuery.isLoading} required>
                            {(durationQuery.data?.content ?? []).map((duration) => <MenuItem key={duration.uuid} value={String(duration.durationMinutes)}>
                                {duration.name} ({duration.durationMinutes} min)
                            </MenuItem>)}
                        </TextField>
                    </Stack>
                    <TextField fullWidth label="Description (optional)" value={bookingDescription}
                        onChange={(event) => setBookingDescription(event.target.value)} />

                    <Box>
                        <Typography variant="h6" sx={{ mb: 0.5 }}>Available times</Typography>
                        <Typography color="text.secondary" variant="body2" sx={{ mb: 1.5 }}>
                            Choose a veterinarian and pet to see open appointments over the next 31 days.
                        </Typography>
                        {!bookingVetUuid || !bookingPetUuid || !selectedDuration ? null : slotsQuery.isLoading ?
                            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}><CircularProgress size={28} /></Box> :
                                slotsQuery.isError ? <Alert severity="error">{slotsQuery.error.message}</Alert> :
                                    slotsByDay.size === 0 ? <Alert severity="info">No open appointments found in this period. Try another veterinarian or visit type.</Alert> :
                                        <Stack spacing={1.5}>
                                            {[...slotsByDay.entries()].map(([date, slots]) => <Paper key={date} variant="outlined" sx={{ p: 1.5 }}>
                                                <Typography sx={{ fontWeight: 600, mb: 1 }}>{formatDay(date)}</Typography>
                                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                                    {slots.map((slot) => <Button key={slot.visitDateFrom}
                                                        size="small"
                                                        variant={selectedSlotKey === slot.visitDateFrom ? "contained" : "outlined"}
                                                        onClick={() => setSelectedSlotKey(slot.visitDateFrom)}>
                                                        {slot.visitDateFrom.slice(11, 16)}
                                                    </Button>)}
                                                </Box>
                                            </Paper>)}
                                        </Stack>}
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setBookingOpen(false)} disabled={bookingBusy}>Cancel</Button>
                <Button variant="contained" onClick={() => void submitBooking()} disabled={bookingBusy || !selectedSlot}>
                    {bookingBusy ? "Booking…" : "Book selected time"}
                </Button>
            </DialogActions>
        </Dialog>

        <Dialog open={Boolean(rescheduling)} onClose={() => !reschedulingBusy && setRescheduling(null)} fullWidth maxWidth="sm">
            <DialogTitle>Reschedule visit</DialogTitle>
            <DialogContent><Stack spacing={2} sx={{ pt: 1 }}>
                {rescheduleError && <Alert severity="error">{rescheduleError}</Alert>}
                <DateTimePickerField label="New date" mode="date" required value={rescheduleDate} onChange={setRescheduleDate} />
                <DateTimePickerField label="New time" mode="time" required value={rescheduleTime} onChange={setRescheduleTime} />
                <TextField fullWidth label="Reason (optional)" value={rescheduleReason} onChange={(event) => setRescheduleReason(event.target.value)} />
            </Stack></DialogContent>
            <DialogActions>
                <Button onClick={() => setRescheduling(null)} disabled={reschedulingBusy}>Cancel</Button>
                <Button variant="contained" onClick={() => void submitReschedule()} disabled={reschedulingBusy || !rescheduleDate || !rescheduleTime}>
                    {reschedulingBusy ? "Saving…" : "Save new time"}
                </Button>
            </DialogActions>
        </Dialog>
    </>;
}
