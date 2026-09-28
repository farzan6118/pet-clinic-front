// src/features/owner/api/ownerApi.ts

import { api } from "../../../lib/api";
import type { OwnerCreateRequest } from "../types/owner";

export async function createOwner(
    request: OwnerCreateRequest
): Promise<void> {
    await api.post("/owners", request);
}