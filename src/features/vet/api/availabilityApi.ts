import { api } from "../../../lib/api";
import { DEFAULT_PAGE_REQUEST, type PageResponse } from "../../../lib/apiTypes";
import type { VetAvailabilityRequest, VetAvailabilityResponse } from "../types/vet";

export async function getVetAvailabilities(
    vetUuid: string,
    params = DEFAULT_PAGE_REQUEST,
): Promise<PageResponse<VetAvailabilityResponse>> {
    const response = await api.get<PageResponse<VetAvailabilityResponse>>(
        `/vets/${vetUuid}/availabilities/page`, { params },
    );
    return response.data;
}

export async function getAvailabilitiesByDate(date: string): Promise<VetAvailabilityResponse[]> {
    const response = await api.get<VetAvailabilityResponse[]>("/vet-availabilities/date", {
        params: { date },
    });
    return response.data;
}

export async function createVetAvailability(
    vetUuid: string,
    request: VetAvailabilityRequest,
): Promise<void> {
    await api.post<void>(`/vets/${vetUuid}/availabilities`, request);
}

export async function updateVetAvailability(
    vetUuid: string,
    availabilityUuid: string,
    request: VetAvailabilityRequest,
): Promise<void> {
    await api.put<void>(`/vets/${vetUuid}/availabilities/${availabilityUuid}`, request);
}

export async function deleteVetAvailability(vetUuid: string, availabilityUuid: string): Promise<void> {
    await api.delete<void>(`/vets/${vetUuid}/availabilities/${availabilityUuid}`);
}
