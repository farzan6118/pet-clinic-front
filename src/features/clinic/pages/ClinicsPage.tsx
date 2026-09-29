import { createClinic, deleteClinic, getClinics, updateClinic } from "../api/clinicApi";
import type { ClinicRequest, ClinicResponse } from "../types/clinic";
import { ResourcePage } from "../../../components/common/ResourcePage";
import { formValuesFromRow, nestedPayload, type ResourceField } from "../../../lib/resourceForms";

const fields: ResourceField[] = [
    { name: "name", label: "Name", required: true },
    { name: "code", label: "Code", type: "number", required: true },
    { name: "active", label: "Active", type: "checkbox" },
    { name: "address.title", label: "Address label" },
    { name: "address.countryName", label: "Country", required: true },
    { name: "address.provinceName", label: "Province", required: true },
    { name: "address.cityName", label: "City", required: true },
    { name: "address.buildingNumber", label: "Building number", required: true },
    { name: "address.floor", label: "Floor", type: "number" },
    { name: "address.unitNumber", label: "Unit" },
    { name: "address.address", label: "Street address", required: true },
    { name: "address.postalCode", label: "Postal code" },
    { name: "address.latitude", label: "Latitude", type: "number" },
    { name: "address.longitude", label: "Longitude", type: "number" },
    { name: "address.description", label: "Directions" },
    { name: "address.defaultAddress", label: "Default address", type: "checkbox" },
];

export function ClinicsPage() {
    return <ResourcePage<ClinicResponse> config={{
        title: "Clinics", queryKey: "clinics", fields,
        columns: [
            { label: "Name", render: (row) => row.name },
            { label: "Code", render: (row) => row.code },
            { label: "City", render: (row) => row.address.cityName },
            { label: "Active", render: (row) => row.active ? "Yes" : "No" },
        ],
        load: async () => (await getClinics({ pageNumber: 0, pageSize: 100 })).content,
        create: (data) => createClinic(data as ClinicRequest),
        update: (uuid, data) => updateClinic(uuid, data as ClinicRequest),
        remove: deleteClinic,
        toPayload: (values) => nestedPayload(values, fields),
        toForm: (row) => formValuesFromRow(row, fields),
    }} />;
}
