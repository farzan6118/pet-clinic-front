import Add from "@mui/icons-material/Add";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import {
    Alert,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    IconButton,
    MenuItem,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { ReactNode } from "react";
import { type FormValues, type ResourceField, type SelectOption } from "../../lib/resourceForms";
import { DateTimePickerField } from "./DateTimePickerField";

export interface ResourceRow { uuid: string }
export interface ResourceColumn<T> { label: string; render: (row: T) => ReactNode }
export interface ResourceConfig<T extends ResourceRow> {
    title: string;
    queryKey: string;
    fields: ResourceField[];
    columns: ResourceColumn<T>[];
    load: () => Promise<T[]>;
    create: (payload: unknown) => Promise<unknown>;
    update: (uuid: string, payload: unknown) => Promise<unknown>;
    remove: (uuid: string) => Promise<unknown>;
    toPayload: (values: FormValues) => unknown;
    toForm?: (row: T) => FormValues;
    canEdit?: boolean;
    canDelete?: boolean;
    canCreate?: boolean;
    createAction?: ReactNode;
    extraActions?: (row: T, refresh: () => void) => ReactNode;
}

function ResourceInput({ field, value, onChange }: {
    field: ResourceField;
    value: string | boolean;
    onChange: (value: string | boolean) => void;
}) {
    const isAsync = typeof field.options === "function";
    const optionQuery = useQuery({
        queryKey: ["form-options", field.name],
        queryFn: isAsync ? field.options as () => Promise<SelectOption[]> : async () => [],
        enabled: isAsync,
    });
    const options: SelectOption[] = Array.isArray(field.options) ? field.options : optionQuery.data ?? [];

    if (field.type === "select") {
        return (
            <TextField select fullWidth label={field.label} required={field.required}
                value={String(value)} onChange={(event) => onChange(event.target.value)}>
                {options.map((option) => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
            </TextField>
        );
    }
    if (field.type === "date" || field.type === "time" || field.type === "datetime-local") {
        return <DateTimePickerField label={field.label} mode={field.type} required={field.required}
            value={String(value)} onChange={onChange} />;
    }
    if (typeof value === "boolean") {
        return <FormControlLabel control={<Checkbox checked={value} onChange={(event) => onChange(event.target.checked)} />} label={field.label} />;
    }
    return (
        <TextField fullWidth label={field.label} type={field.type ?? "text"} required={field.required}
            value={value} onChange={(event) => onChange(event.target.value)}
        />
    );
}

export function ResourcePage<T extends ResourceRow>({ config }: { config: ResourceConfig<T> }) {
    const query = useQuery({ queryKey: [config.queryKey], queryFn: config.load });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<T | null>(null);
    const [values, setValues] = useState<FormValues>({});
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<T | null>(null);

    const openCreate = () => {
        setEditing(null);
        setValues(Object.fromEntries(config.fields.map((field) => [field.name, field.type === "select" ? "" : field.type === "number" ? "" : field.type === "checkbox" ? false : ""])));
        setError("");
        setDialogOpen(true);
    };
    const openEdit = (row: T) => {
        setEditing(row);
        setValues(config.toForm?.(row) ?? {});
        setError("");
        setDialogOpen(true);
    };
    const save = async () => {
        setBusy(true);
        setError("");
        try {
            const payload = config.toPayload(values);
            if (editing) await config.update(editing.uuid, payload);
            else await config.create(payload);
            setDialogOpen(false);
            await query.refetch();
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Could not save changes.");
        } finally {
            setBusy(false);
        }
    };
    const remove = async () => {
        if (!deleteTarget) return;
        setBusy(true);
        setError("");
        try {
            await config.remove(deleteTarget.uuid);
            setDeleteTarget(null);
            await query.refetch();
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Could not delete this item.");
            setDeleteTarget(null);
        } finally {
            setBusy(false);
        }
    };
    const rows = query.data ?? [];
    const refresh = () => { void query.refetch(); };

    return (
        <Stack spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="h4">{config.title}</Typography>
                {config.createAction ?? (config.canCreate === false ? null :
                    <Button variant="contained" startIcon={<Add />} onClick={openCreate}>Add {config.title.replace(/s$/, "")}</Button>)}
            </Box>
            {query.isError && <Alert severity="error">{query.error.message}</Alert>}
            {error && !dialogOpen && <Alert severity="error">{error}</Alert>}
            <Paper variant="outlined">
                {query.isLoading ? <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}><CircularProgress /></Box> : (
                    <Table>
                        <TableHead><TableRow>
                            {config.columns.map((column) => <TableCell key={column.label}><b>{column.label}</b></TableCell>)}
                            <TableCell align="right"><b>Actions</b></TableCell>
                        </TableRow></TableHead>
                        <TableBody>
                            {rows.map((row) => <TableRow hover key={row.uuid}>
                                {config.columns.map((column) => <TableCell key={column.label}>{column.render(row)}</TableCell>)}
                                <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                                    {config.extraActions?.(row, refresh)}
                                    {config.canEdit !== false && <Tooltip title="Edit"><IconButton aria-label={`Edit ${config.title}`} onClick={() => openEdit(row)}><EditOutlined /></IconButton></Tooltip>}
                                    {config.canDelete !== false && <Tooltip title="Delete"><IconButton aria-label={`Delete ${config.title}`} color="error" onClick={() => setDeleteTarget(row)}><DeleteOutlined /></IconButton></Tooltip>}
                                </TableCell>
                            </TableRow>)}
                            {!rows.length && <TableRow><TableCell colSpan={config.columns.length + 1} align="center">No records found.</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                )}
            </Paper>

            <Dialog open={dialogOpen} onClose={() => !busy && setDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{editing ? `Edit ${config.title.replace(/s$/, "")}` : `Add ${config.title.replace(/s$/, "")}`}</DialogTitle>
                <DialogContent><Stack spacing={2} sx={{ pt: 1 }}>
                    {error && <Alert severity="error">{error}</Alert>}
                    {config.fields.map((field) => <ResourceInput key={field.name} field={field}
                        value={values[field.name] ?? (field.type === "checkbox" ? false : "")}
                        onChange={(value) => setValues((previous) => ({ ...previous, [field.name]: value }))} />)}
                </Stack></DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} disabled={busy}>Cancel</Button>
                    <Button variant="contained" onClick={() => void save()} disabled={busy}>{busy ? "Saving…" : "Save"}</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={Boolean(deleteTarget)} onClose={() => !busy && setDeleteTarget(null)}>
                <DialogTitle>Delete this record?</DialogTitle>
                <DialogContent>This action cannot be undone.</DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteTarget(null)} disabled={busy}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={() => void remove()} disabled={busy}>Delete</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
