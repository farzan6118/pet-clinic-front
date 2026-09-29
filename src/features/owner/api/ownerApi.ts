import { api } from "../../../lib/api";
import type {
    OwnerCreateRequest,
    OwnerPageRequest,
    OwnerResponse,
    OwnerUpdateRequest,
    PageResponse,
} from "../types/owner";
import type { PetResponse } from "../../pet/types/pet";

const OWNER_PAGE_DEFAULTS: OwnerPageRequest = {
    pageNumber: 0,
    pageSize: 10,
};

export async function getOwners(
    request: OwnerPageRequest = OWNER_PAGE_DEFAULTS,
): Promise<PageResponse<OwnerResponse>> {
    const response = await api.get<PageResponse<OwnerResponse>>("/owners/page", {
        params: request,
    });
    return response.data;
}

export async function getOwner(uuid: string): Promise<OwnerResponse> {
    const response = await api.get<OwnerResponse>(`/owners/${uuid}`);
    return response.data;
}

export async function getOwnerPets(uuid: string): Promise<PetResponse[]> {
    const response = await api.get<PetResponse[]>(`/owners/${uuid}/pets`);
    return response.data;
}

export async function createOwner(request: OwnerCreateRequest): Promise<void> {
    await api.post<void>("/owners", request);
}

export async function updateOwner(
    uuid: string,
    request: OwnerUpdateRequest,
): Promise<void> {
    await api.put<void>(`/owners/${uuid}`, request);
}

export async function deleteOwner(uuid: string): Promise<void> {
    await api.delete<void>(`/owners/${uuid}`);
}
