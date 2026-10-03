import type { PageRequest } from "../../../lib/apiTypes";
import type { AddressRequest, AddressResponse, ContactRequest, ContactResponse, PersonRequest, PersonResponse } from "../../person/types/person";

export interface VetRequest {
    person: PersonRequest;
    contact: ContactRequest;
    address: AddressRequest;
    clinicUuid?: string | null;
}

export interface VetResponse {
    uuid: string;
    person: PersonResponse;
    profile: ContactResponse;
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
