export interface LoginRequest {
    username: string;
    password: string;
}

export interface AccessTokenResponse {
    access_token: string;
    expires_in?: number;
    refresh_expires_in?: number;
    refresh_token?: string;
    token_type?: string;
    "not-before-policy"?: number;
    session_state?: string;
    scope?: string;
    id_token?: string;
}

export interface CurrentUserResponse {
    givenName: string | null;
    familyName: string | null;
    email: string | null;
    MobileNumber: string | null;
    nationalId: string | null;
}
