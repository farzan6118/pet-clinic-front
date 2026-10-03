import { getOwners, createOwner, updateOwner, deleteOwner } from "../api/ownerApi";
import type { OwnerCreateRequest, OwnerResponse } from "../types/owner";
import { ResourcePage } from "../../../components/common/ResourcePage";
import { formValuesFromRow, nestedPayload, type ResourceField } from "../../../lib/resourceForms";

const fields: ResourceField[] = [
    { name: "person.title", label: "Title" },
    { name: "person.firstName", label: "First name", required: true },
    { name: "person.lastName", label: "Last name", required: true },
    { name: "person.nationalId", label: "National ID" },
    { name: "contact.email", label: "Email", type: "email", required: true },
    { name: "contact.mobileNumber", label: "Mobile number", required: true },
    { name: "contact.socialMedia", label: "Social media" },
    { name: "person.birthDate", label: "Birth date", type: "date" },
    { name: "person.photo", label: "Photo URL" },
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
    { name: "address.description", label: "Address directions" },
    { name: "address.defaultAddress", label: "Default address", type: "checkbox" },
];

export function OwnerListPage() {
    return <ResourcePage<OwnerResponse> config={{
        title: "Owners",
        queryKey: "owners",
        fields,
        columns: [
            { label: "Name", render: (row) => `${row.person.firstName ?? ""} ${row.person.lastName ?? ""}`.trim() || "—" },
            { label: "Email", render: (row) => row.contact.email },
            { label: "Mobile", render: (row) => row.contact.mobileNumber },
            { label: "City", render: (row) => row.address.cityName },
        ],
        load: async () => (await getOwners({ pageNumber: 0, pageSize: 100 })).content,
        create: (data) => createOwner(data as OwnerCreateRequest),
        update: (uuid, data) => updateOwner(uuid, data as OwnerCreateRequest),
        remove: deleteOwner,
        toPayload: (values) => nestedPayload(values, fields),
        toForm: (row) => formValuesFromRow(row, fields),
    }} />;
}
