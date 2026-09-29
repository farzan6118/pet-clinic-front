import { api } from "../../../lib/api";
import { DEFAULT_PAGE_REQUEST, type PageRequest, type PageResponse, type UuidAndTitle } from "../../../lib/apiTypes";
import type { RoomTypeRequest, RoomTypeResponse } from "../types/clinic";

export async function getRoomTypes(params: PageRequest = DEFAULT_PAGE_REQUEST): Promise<PageResponse<RoomTypeResponse>> {
    const response = await api.get<PageResponse<RoomTypeResponse>>("/room-types/page", { params });
    return response.data;
}

export async function getRoomTypeOptions(): Promise<UuidAndTitle[]> {
    const response = await api.get<UuidAndTitle[]>("/room-types");
    return response.data;
}

export async function getRoomType(uuid: string): Promise<RoomTypeResponse> {
    const response = await api.get<RoomTypeResponse>(`/room-types/${uuid}`);
    return response.data;
}

export async function createRoomType(request: RoomTypeRequest): Promise<void> {
    await api.post<void>("/room-types", request);
}

export async function updateRoomType(uuid: string, request: RoomTypeRequest): Promise<void> {
    await api.put<void>(`/room-types/${uuid}`, request);
}

export async function deleteRoomType(uuid: string): Promise<void> {
    await api.delete<void>(`/room-types/${uuid}`);
}
