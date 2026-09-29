export type FormValues = Record<string, string | boolean>;
export interface SelectOption { value: string; label: string }
export interface ResourceField {
    name: string;
    label: string;
    type?: "text" | "email" | "number" | "date" | "datetime-local" | "time" | "select" | "checkbox";
    required?: boolean;
    options?: SelectOption[] | (() => Promise<SelectOption[]>);
}

export function formValuesFromRow(row: unknown, fields: ResourceField[]): FormValues {
    const source = row as Record<string, unknown>;
    return Object.fromEntries(fields.map((field) => {
        const value = field.name.split(".").reduce<unknown>((current, key) =>
            current && typeof current === "object" ? (current as Record<string, unknown>)[key] : undefined, source);
        if (field.type === "checkbox") return [field.name, Boolean(value)];
        if (value == null) return [field.name, ""];
        const text = String(value);
        if (field.type === "date") return [field.name, text.slice(0, 10)];
        if (field.type === "datetime-local") return [field.name, text.slice(0, 16)];
        return [field.name, text];
    }));
}

export function nestedPayload(values: FormValues, fields: ResourceField[]): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const field of fields) {
        const raw = values[field.name];
        if (field.type !== "checkbox" && (raw === "" || raw === undefined) && !field.required) continue;
        const value = field.type === "checkbox" ? Boolean(raw)
            : field.type === "number" ? Number(raw)
                : raw;
        const parts = field.name.split(".");
        let target = result;
        for (const part of parts.slice(0, -1)) {
            target[part] ??= {};
            target = target[part] as Record<string, unknown>;
        }
        target[parts[parts.length - 1]] = value;
    }
    return result;
}
