import { api } from "../../../lib/api";
import { DEFAULT_PAGE_REQUEST, type PageResponse, type UuidAndTitle } from "../../../lib/apiTypes";
import type { ClinicPageRequest, ClinicRequest, ClinicResponse } from "../types/clinic";

export async function getClinics(params: ClinicPageRequest = DEFAULT_PAGE_REQUEST): Promise<PageResponse<ClinicResponse>> {
    const response = await api.get<PageResponse<ClinicResponse>>("/clinics/page", { params });
    return response.data;
}

export async function getClinicOptions(): Promise<UuidAndTitle[]> {
    const response = await api.get<UuidAndTitle[]>("/clinics");
    return response.data;
}

export async function getClinic(uuid: string): Promise<ClinicResponse> {
    const response = await api.get<ClinicResponse>(`/clinics/${uuid}`);
    return response.data;
}

export async function createClinic(request: ClinicRequest): Promise<void> {
    await api.post<void>("/clinics", request);
}

export async function updateClinic(uuid: string, request: ClinicRequest): Promise<void> {
    await api.put<void>(`/clinics/${uuid}`, request);
}

export async function deleteClinic(uuid: string): Promise<void> {
    await api.delete<void>(`/clinics/${uuid}`);
}
