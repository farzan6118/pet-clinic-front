import CalendarMonth from "@mui/icons-material/CalendarMonth";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Schedule from "@mui/icons-material/Schedule";
import {
    Box,
    Button,
    IconButton,
    Paper,
    Popover,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useMemo, useState, type MouseEvent } from "react";

type PickerMode = "date" | "time" | "datetime-local";

interface DateTimePickerFieldProps {
    label: string;
    value: string;
    mode: PickerMode;
    required?: boolean;
    onChange: (value: string) => void;
}

const pad = (value: number) => String(value).padStart(2, "0");
const today = () => {
    const now = new Date();
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};
const datePart = (value: string) => value.slice(0, 10) || today();
const timePart = (value: string) => value.slice(11, 16) || "09:00";
const monthTitle = (year: number, month: number) =>
    new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(new Date(year, month, 1));

export function DateTimePickerField({ label, value, mode, required, onChange }: DateTimePickerFieldProps) {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const selectedDate = datePart(value);
    const [year, month] = selectedDate.split("-").map(Number);
    const [visibleMonth, setVisibleMonth] = useState(() => new Date(year, month - 1, 1));
    const open = (event: MouseEvent<HTMLElement>) => {
        const [nextYear, nextMonth] = selectedDate.split("-").map(Number);
        setVisibleMonth(new Date(nextYear, nextMonth - 1, 1));
        setAnchor(event.currentTarget);
    };

    const days = useMemo(() => {
        const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
        const startOffset = (firstDay.getDay() + 6) % 7;
        const gridStart = new Date(firstDay.getFullYear(), firstDay.getMonth(), 1 - startOffset);
        return Array.from({ length: 42 }, (_, index) => {
            const day = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index);
            return {
                date: `${day.getFullYear()}-${pad(day.getMonth() + 1)}-${pad(day.getDate())}`,
                day: day.getDate(),
                currentMonth: day.getMonth() === visibleMonth.getMonth(),
            };
        });
    }, [visibleMonth]);

    const chooseDate = (date: string) => {
        onChange(mode === "datetime-local" ? `${date}T${timePart(value)}` : date);
        if (mode === "date") setAnchor(null);
    };
    const chooseTime = (time: string) => {
        onChange(mode === "datetime-local" ? `${datePart(value)}T${time}` : time);
        if (mode === "time") setAnchor(null);
    };
    const displayValue = mode === "date" ? value : mode === "time" ? value : value.replace("T", " ");

    return <>
        <TextField
            fullWidth
            label={label}
            required={required}
            value={displayValue}
            placeholder={mode === "datetime-local" ? "Choose date and time" : mode === "date" ? "Choose a date" : "Choose a time"}
            onClick={open}
            slotProps={{
                input: { readOnly: true, endAdornment: mode === "time" ? <Schedule color="action" /> : <CalendarMonth color="action" /> },
                inputLabel: { shrink: true },
            }}
        />
        <Popover open={Boolean(anchor)} anchorEl={anchor} onClose={() => setAnchor(null)} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
            <Paper elevation={0} sx={{ p: 2, width: mode === "datetime-local" ? 390 : 320 }}>
                {(mode === "date" || mode === "datetime-local") && <>
                    <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                        <IconButton aria-label="Previous month" onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}><ChevronLeft /></IconButton>
                        <Typography sx={{ fontWeight: 600 }}>{monthTitle(visibleMonth.getFullYear(), visibleMonth.getMonth())}</Typography>
                        <IconButton aria-label="Next month" onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))}><ChevronRight /></IconButton>
                    </Stack>
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0.5, textAlign: "center" }}>
                        {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => <Typography key={`${day}-${index}`} variant="caption" color="text.secondary" sx={{ py: 0.5 }}>{day}</Typography>)}
                        {days.map(({ date, day, currentMonth }) => <Button
                            key={date}
                            size="small"
                            variant={selectedDate === date ? "contained" : "text"}
                            color={date === today() && selectedDate !== date ? "primary" : "inherit"}
                            onClick={() => chooseDate(date)}
                            sx={{ minWidth: 0, px: 0, opacity: currentMonth ? 1 : 0.4 }}
                        >{day}</Button>)}
                    </Box>
                </>}
                {(mode === "time" || mode === "datetime-local") && <>
                    {mode === "datetime-local" && <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Choose a time</Typography>}
                    {mode === "time" && <Typography variant="subtitle2" sx={{ mb: 1 }}>Choose a time</Typography>}
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0.75, maxHeight: 240, overflowY: "auto" }}>
                        {Array.from({ length: 96 }, (_, index) => `${pad(Math.floor(index * 15 / 60))}:${pad(index * 15 % 60)}`).map((time) => <Button
                            key={time}
                            size="small"
                            variant={timePart(value) === time ? "contained" : "outlined"}
                            onClick={() => chooseTime(time)}
                        >{time}</Button>)}
                    </Box>
                </>}
                {mode === "datetime-local" && <Button fullWidth sx={{ mt: 1.5 }} onClick={() => setAnchor(null)}>Done</Button>}
            </Paper>
        </Popover>
    </>;
}
