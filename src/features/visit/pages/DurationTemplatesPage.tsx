import { createDurationTemplate, deleteDurationTemplate, getDurationTemplates, updateDurationTemplate } from "../api/durationTemplateApi";
import type { DurationTemplateRequest, DurationTemplateResponse } from "../types/visit";
import { ResourcePage } from "../../../components/common/ResourcePage";
import { formValuesFromRow, nestedPayload, type ResourceField } from "../../../lib/resourceForms";

const fields: ResourceField[] = [
    { name: "name", label: "Name", required: true },
    { name: "durationMinutes", label: "Duration in minutes", type: "number", required: true },
    { name: "description", label: "Description" },
];

export function DurationTemplatesPage() {
    return <ResourcePage<DurationTemplateResponse> config={{
        title: "Duration templates", queryKey: "duration-templates", fields,
        columns: [
            { label: "Name", render: (row) => row.name },
            { label: "Duration", render: (row) => `${row.durationMinutes} min` },
            { label: "Description", render: (row) => row.description ?? "—" },
        ],
        load: async () => (await getDurationTemplates({ pageNumber: 0, pageSize: 100 })).content,
        create: (data) => createDurationTemplate(data as DurationTemplateRequest),
        update: (uuid, data) => updateDurationTemplate(uuid, data as DurationTemplateRequest),
        remove: deleteDurationTemplate,
        toPayload: (values) => nestedPayload(values, fields),
        toForm: (row) => formValuesFromRow(row, fields),
    }} />;
}
