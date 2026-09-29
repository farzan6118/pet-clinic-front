import { api } from "../../../lib/api";
import { DEFAULT_PAGE_REQUEST, type PageResponse } from "../../../lib/apiTypes";
import type {
    MedicalRecordResponse,
    PetPageRequest,
    PetRequest,
    PetResponse,
} from "../types/pet";

export async function getPets(
    params: PetPageRequest = DEFAULT_PAGE_REQUEST,
): Promise<PageResponse<PetResponse>> {
    const response = await api.get<PageResponse<PetResponse>>("/pets/page", { params });
    return response.data;
}

export async function getPet(uuid: string): Promise<PetResponse> {
    const response = await api.get<PetResponse>(`/pets/${uuid}`);
    return response.data;
}

export async function getPetMedicalRecord(uuid: string): Promise<MedicalRecordResponse> {
    const response = await api.get<MedicalRecordResponse>(`/pets/${uuid}/medical-record`);
    return response.data;
}

export async function createPet(request: PetRequest): Promise<void> {
    await api.post<void>("/pets", request);
}

export async function updatePet(uuid: string, request: PetRequest): Promise<void> {
    await api.put<void>(`/pets/${uuid}`, request);
}

export async function deletePet(uuid: string): Promise<void> {
    await api.delete<void>(`/pets/${uuid}`);
}
