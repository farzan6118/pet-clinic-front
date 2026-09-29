import { api } from "../../../lib/api";
import { DEFAULT_PAGE_REQUEST, type PageResponse, type UuidAndTitle } from "../../../lib/apiTypes";
import type { VetPageRequest, VetRequest, VetResponse } from "../types/vet";

export async function getVets(
    params: VetPageRequest = DEFAULT_PAGE_REQUEST,
): Promise<PageResponse<VetResponse>> {
    const response = await api.get<PageResponse<VetResponse>>("/vets/page", { params });
    return response.data;
}

export async function getVetOptions(): Promise<UuidAndTitle[]> {
    const response = await api.get<UuidAndTitle[]>("/vets");
    return response.data;
}

export async function getVet(uuid: string): Promise<VetResponse> {
    const response = await api.get<VetResponse>(`/vets/${uuid}`);
    return response.data;
}

export async function createVet(request: VetRequest): Promise<void> {
    await api.post<void>("/vets", request);
}

export async function updateVet(uuid: string, request: VetRequest): Promise<void> {
    await api.put<void>(`/vets/${uuid}`, request);
}

export async function deleteVet(uuid: string): Promise<void> {
    await api.delete<void>(`/vets/${uuid}`);
}
