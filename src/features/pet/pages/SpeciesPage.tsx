import { createSpecies, deleteSpecies, getSpeciesPage, updateSpecies } from "../api/speciesApi";
import type { SpeciesRequest, SpeciesResponse } from "../types/pet";
import { ResourcePage } from "../../../components/common/ResourcePage";
import { formValuesFromRow, nestedPayload, type ResourceField } from "../../../lib/resourceForms";

const fields: ResourceField[] = [
    { name: "name", label: "Name", required: true },
    { name: "code", label: "Code", required: true },
    { name: "origin", label: "Origin" },
    { name: "description", label: "Description" },
];

export function SpeciesPage() {
    return <ResourcePage<SpeciesResponse> config={{
        title: "Species", queryKey: "species", fields,
        columns: [
            { label: "Name", render: (row) => row.name },
            { label: "Code", render: (row) => row.code },
            { label: "Origin", render: (row) => row.origin ?? "—" },
            { label: "Description", render: (row) => row.description ?? "—" },
        ],
        load: async () => (await getSpeciesPage({ pageNumber: 0, pageSize: 100 })).content,
        create: (data) => createSpecies(data as SpeciesRequest),
        update: (uuid, data) => updateSpecies(uuid, data as SpeciesRequest),
        remove: deleteSpecies,
        toPayload: (values) => nestedPayload(values, fields),
        toForm: (row) => formValuesFromRow(row, fields),
    }} />;
}
