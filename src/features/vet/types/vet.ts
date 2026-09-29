import type { PageRequest } from "../../../lib/apiTypes";
import type { AddressRequest, AddressResponse, PersonRequest, PersonResponse, ProfileRequest, ProfileResponse } from "../../person/types/person";

export interface VetRequest {
    person: PersonRequest;
    profile: ProfileRequest;
    address: AddressRequest;
    clinicUuid?: string | null;
}

export interface VetResponse {
    uuid: string;
    person: PersonResponse;
    profile: ProfileResponse;
    address: AddressResponse;
    clinicUuid: string | null;
}

export interface VetAvailabilityRequest {
    vetUuid: string;
    startTime: string;
    endTime: string;
}

export interface VetAvailabilityResponse {
    uuid: string;
    vetUuid: string;
    name: string;
    date: string;
    startTime: string;
    endTime: string;
    active: boolean | null;
}

export type VetPageRequest = PageRequest & {
    sortBy?: "createdDate" | "lastModifiedDate";
};
