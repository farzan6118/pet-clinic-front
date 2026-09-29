import { api } from "../../../lib/api";
import type { AccessTokenResponse, CurrentUserResponse, LoginRequest } from "../types/auth";

export async function login(request: LoginRequest): Promise<AccessTokenResponse> {
    const response = await api.post<AccessTokenResponse>("/auth/login", request);
    return response.data;
}

export async function getCurrentUser(): Promise<CurrentUserResponse> {
    const response = await api.get<CurrentUserResponse>("/user/me");
    return response.data;
}
