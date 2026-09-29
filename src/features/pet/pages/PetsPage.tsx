import { getOwners } from "../../owner/api/ownerApi";
import { getSpeciesOptions } from "../api/speciesApi";
import { createPet, deletePet, getPets, updatePet } from "../api/petApi";
import type { PetRequest, PetResponse, Sex } from "../types/pet";
import { ResourcePage } from "../../../components/common/ResourcePage";
import { formValuesFromRow, nestedPayload, type ResourceField } from "../../../lib/resourceForms";

const fields: ResourceField[] = [
    { name: "name", label: "Name", required: true },
    { name: "color", label: "Color" },
    { name: "marks", label: "Marks" },
    { name: "sex", label: "Sex", type: "select", required: true, options: ["FEMALE", "MALE", "DIVERSE"].map((value) => ({ value, label: value })) },
    { name: "birthDate", label: "Birth date", type: "date" },
    { name: "speciesUuid", label: "Species", type: "select", required: true, options: async () => (await getSpeciesOptions()).map(({ uuid, title }) => ({ value: uuid, label: title })) },
    { name: "ownerUuid", label: "Owner", type: "select", required: true, options: async () => (await getOwners({ pageNumber: 0, pageSize: 100 })).content.map((owner) => ({ value: owner.uuid, label: `${owner.person.firstName ?? ""} ${owner.person.lastName ?? ""}`.trim() || owner.profile.email })) },
];

export function PetsPage() {
    return <ResourcePage<PetResponse> config={{
        title: "Pets", queryKey: "pets", fields,
        columns: [
            { label: "Name", render: (row) => row.name },
            { label: "Species", render: (row) => row.species },
            { label: "Sex", render: (row) => row.sex },
            { label: "Birth date", render: (row) => row.birthDate ?? "—" },
        ],
        load: async () => (await getPets({ pageNumber: 0, pageSize: 100 })).content,
        create: (data) => createPet(data as PetRequest),
        update: (uuid, data) => updatePet(uuid, data as PetRequest),
        remove: deletePet,
        toPayload: (values) => ({ ...nestedPayload(values, fields), sex: values.sex as Sex }),
        toForm: (row) => formValuesFromRow(row, fields),
    }} />;
}
