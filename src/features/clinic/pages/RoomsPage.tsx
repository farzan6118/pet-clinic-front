import { getClinicOptions } from "../api/clinicApi";
import { getRoomTypeOptions } from "../api/roomTypeApi";
import { createRoom, deleteRoom, getRooms, updateRoom } from "../api/roomApi";
import type { RoomRequest, RoomResponse } from "../types/clinic";
import { ResourcePage } from "../../../components/common/ResourcePage";
import { formValuesFromRow, nestedPayload, type ResourceField } from "../../../lib/resourceForms";

const fields: ResourceField[] = [
    { name: "name", label: "Name", required: true },
    { name: "roomNumber", label: "Room number", required: true },
    { name: "roomTypeUuid", label: "Room type", type: "select", required: true, options: async () => (await getRoomTypeOptions()).map(({ uuid, title }) => ({ value: uuid, label: title })) },
    { name: "clinicUuid", label: "Building", type: "select", required: true, options: async () => (await getClinicOptions()).map(({ uuid, title }) => ({ value: uuid, label: title })) },
    { name: "active", label: "Active", type: "checkbox" },
];

export function RoomsPage() {
    return <ResourcePage<RoomResponse> config={{
        title: "Rooms", queryKey: "rooms", fields,
        columns: [
            { label: "Name", render: (row) => row.name },
            { label: "Room number", render: (row) => row.roomNumber },
            { label: "Room type", render: (row) => row.roomType.name },
            { label: "Building", render: (row) => row.building.name },
            { label: "Active", render: (row) => row.active ? "Yes" : "No" },
        ],
        load: async () => (await getRooms({ pageNumber: 0, pageSize: 100 })).content,
        create: (data) => createRoom(data as RoomRequest),
        update: (uuid, data) => updateRoom(uuid, data as RoomRequest),
        remove: deleteRoom,
        toPayload: (values) => nestedPayload(values, fields),
        toForm: (row) => formValuesFromRow({ ...row, roomTypeUuid: row.roomType.uuid, clinicUuid: row.building.uuid }, fields),
    }} />;
}
