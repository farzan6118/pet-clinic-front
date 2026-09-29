import { getClinicOptions } from "../../clinic/api/clinicApi";
import { createVet, deleteVet, getVets, updateVet } from "../api/vetApi";
import type { VetRequest, VetResponse } from "../types/vet";
import { ResourcePage } from "../../../components/common/ResourcePage";
import { formValuesFromRow, nestedPayload, type ResourceField } from "../../../lib/resourceForms";

const fields: ResourceField[] = [
    { name: "person.title", label: "Title" },
    { name: "person.firstName", label: "First name", required: true },
    { name: "person.lastName", label: "Last name", required: true },
    { name: "person.nationalId", label: "National ID" },
    { name: "profile.email", label: "Email", type: "email", required: true },
    { name: "profile.mobileNumber", label: "Mobile number", required: true },
    { name: "profile.birthDate", label: "Birth date", type: "date" },
    { name: "profile.photo", label: "Photo URL" },
    { name: "address.countryName", label: "Country", required: true },
    { name: "address.provinceName", label: "Province", required: true },
    { name: "address.cityName", label: "City", required: true },
    { name: "address.buildingNumber", label: "Building number", required: true },
    { name: "address.floor", label: "Floor", type: "number" },
    { name: "address.unitNumber", label: "Unit" },
    { name: "address.address", label: "Street address", required: true },
    { name: "address.postalCode", label: "Postal code" },
    { name: "address.defaultAddress", label: "Default address", type: "checkbox" },
    { name: "clinicUuid", label: "Clinic", type: "select", options: async () => (await getClinicOptions()).map(({ uuid, title }) => ({ value: uuid, label: title })) },
];

export function VetsPage() {
    return <ResourcePage<VetResponse> config={{
        title: "Vets", queryKey: "vets", fields,
        columns: [
            { label: "Name", render: (row) => `${row.person.firstName ?? ""} ${row.person.lastName ?? ""}`.trim() || "—" },
            { label: "Email", render: (row) => row.profile.email },
            { label: "Mobile", render: (row) => row.profile.mobileNumber },
            { label: "Clinic", render: (row) => row.clinicUuid ?? "—" },
        ],
        load: async () => (await getVets({ pageNumber: 0, pageSize: 100 })).content,
        create: (data) => createVet(data as VetRequest),
        update: (uuid, data) => updateVet(uuid, data as VetRequest),
        remove: deleteVet,
        toPayload: (values) => nestedPayload(values, fields),
        toForm: (row) => formValuesFromRow(row, fields),
    }} />;
}
