import { api } from "../../../lib/api";
import { DEFAULT_PAGE_REQUEST, type PageResponse, type UuidAndTitle } from "../../../lib/apiTypes";
import type { SpeciesRequest, SpeciesResponse } from "../types/pet";

export async function getSpeciesPage(
    params = DEFAULT_PAGE_REQUEST,
): Promise<PageResponse<SpeciesResponse>> {
    const response = await api.get<PageResponse<SpeciesResponse>>("/species/page", { params });
    return response.data;
}

export async function getSpeciesOptions(): Promise<UuidAndTitle[]> {
    const response = await api.get<UuidAndTitle[]>("/species");
    return response.data;
}

export async function getSpecies(uuid: string): Promise<SpeciesResponse> {
    const response = await api.get<SpeciesResponse>(`/species/${uuid}`);
    return response.data;
}

export async function createSpecies(request: SpeciesRequest): Promise<void> {
    await api.post<void>("/species", request);
}

export async function updateSpecies(uuid: string, request: SpeciesRequest): Promise<void> {
    await api.put<void>(`/species/${uuid}`, request);
}

export async function deleteSpecies(uuid: string): Promise<void> {
    await api.delete<void>(`/species/${uuid}`);
}
