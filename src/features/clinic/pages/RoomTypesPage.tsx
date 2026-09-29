import { createRoomType, deleteRoomType, getRoomTypes, updateRoomType } from "../api/roomTypeApi";
import type { RoomTypeRequest, RoomTypeResponse } from "../types/clinic";
import { ResourcePage } from "../../../components/common/ResourcePage";
import { formValuesFromRow, nestedPayload, type ResourceField } from "../../../lib/resourceForms";

const fields: ResourceField[] = [
    { name: "name", label: "Name", required: true },
    { name: "description", label: "Description" },
];

export function RoomTypesPage() {
    return <ResourcePage<RoomTypeResponse> config={{
        title: "Room types", queryKey: "room-types", fields,
        columns: [
            { label: "Name", render: (row) => row.name },
            { label: "Description", render: (row) => row.description ?? "—" },
            { label: "Status", render: (row) => row.status },
        ],
        load: async () => (await getRoomTypes({ pageNumber: 0, pageSize: 100 })).content,
        create: (data) => createRoomType(data as RoomTypeRequest),
        update: (uuid, data) => updateRoomType(uuid, data as RoomTypeRequest),
        remove: deleteRoomType,
        toPayload: (values) => nestedPayload(values, fields),
        toForm: (row) => formValuesFromRow(row, fields),
    }} />;
}
