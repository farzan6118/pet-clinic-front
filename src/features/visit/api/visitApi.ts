import { api } from "../../../lib/api";
import { DEFAULT_PAGE_REQUEST, type PageRequest, type PageResponse } from "../../../lib/apiTypes";
import type { CompleteVisitRequest, RescheduleVisitRequest, VisitRequest, VisitResponse, VisitSearchRequest } from "../types/visit";

export async function getVisits(params: PageRequest = DEFAULT_PAGE_REQUEST): Promise<PageResponse<VisitResponse>> {
    const response = await api.get<PageResponse<VisitResponse>>("/visits/page", { params });
    return response.data;
}

export async function searchVisits(params: VisitSearchRequest): Promise<PageResponse<VisitResponse>> {
    const response = await api.get<PageResponse<VisitResponse>>("/visits/search", { params });
    return response.data;
}

export async function getVisit(uuid: string): Promise<VisitResponse> {
    const response = await api.get<VisitResponse>(`/visits/${uuid}`);
    return response.data;
}

export async function createVisit(request: VisitRequest): Promise<void> {
    await api.post<void>("/visits", request);
}

export async function rescheduleVisit(uuid: string, request: RescheduleVisitRequest): Promise<void> {
    await api.put<void>(`/visits/${uuid}`, request);
}

export async function cancelVisit(uuid: string, reason?: string): Promise<void> {
    await api.delete<void>(`/visits/${uuid}`, { params: { reason } });
}

export async function completeVisit(uuid: string, request: CompleteVisitRequest): Promise<void> {
    await api.patch<void>(`/visits/${uuid}/complete`, request);
}
