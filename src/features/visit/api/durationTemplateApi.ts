import { api } from "../../../lib/api";
import { DEFAULT_PAGE_REQUEST, type PageRequest, type PageResponse, type UuidAndTitle } from "../../../lib/apiTypes";
import type { DurationTemplateRequest, DurationTemplateResponse } from "../types/visit";

export async function getDurationTemplates(params: PageRequest = DEFAULT_PAGE_REQUEST): Promise<PageResponse<DurationTemplateResponse>> {
    const response = await api.get<PageResponse<DurationTemplateResponse>>("/duration-templates/page", { params });
    return response.data;
}

export async function getDurationTemplateOptions(): Promise<UuidAndTitle[]> {
    const response = await api.get<UuidAndTitle[]>("/duration-templates");
    return response.data;
}

export async function getDurationTemplate(uuid: string): Promise<DurationTemplateResponse> {
    const response = await api.get<DurationTemplateResponse>(`/duration-templates/${uuid}`);
    return response.data;
}

export async function createDurationTemplate(request: DurationTemplateRequest): Promise<void> {
    await api.post<void>("/duration-templates", request);
}

export async function updateDurationTemplate(uuid: string, request: DurationTemplateRequest): Promise<void> {
    await api.put<void>(`/duration-templates/${uuid}`, request);
}

export async function deleteDurationTemplate(uuid: string): Promise<void> {
    await api.delete<void>(`/duration-templates/${uuid}`);
}
