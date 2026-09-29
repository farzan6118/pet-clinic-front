import { api } from "../../../lib/api";
import { DEFAULT_PAGE_REQUEST, type PageRequest, type PageResponse, type UuidAndTitle } from "../../../lib/apiTypes";
import type { RoomRequest, RoomResponse } from "../types/clinic";

export async function getRooms(params: PageRequest = DEFAULT_PAGE_REQUEST): Promise<PageResponse<RoomResponse>> {
    const response = await api.get<PageResponse<RoomResponse>>("/rooms/page", { params });
    return response.data;
}

export async function getRoomOptions(): Promise<UuidAndTitle[]> {
    const response = await api.get<UuidAndTitle[]>("/rooms");
    return response.data;
}

export async function getRoom(uuid: string): Promise<RoomResponse> {
    const response = await api.get<RoomResponse>(`/rooms/${uuid}`);
    return response.data;
}

export async function createRoom(request: RoomRequest): Promise<void> {
    await api.post<void>("/rooms", request);
}

export async function updateRoom(uuid: string, request: RoomRequest): Promise<void> {
    await api.put<void>(`/rooms/${uuid}`, request);
}

export async function deleteRoom(uuid: string): Promise<void> {
    await api.delete<void>(`/rooms/${uuid}`);
}
