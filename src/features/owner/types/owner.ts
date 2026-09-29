import type {
    AddressRequest,
    AddressResponse,
    PersonRequest,
    PersonResponse,
    ProfileRequest,
    ProfileResponse,
} from "../../person/types/person";
import type { PageRequest } from "../../../lib/apiTypes";

export type {
    AddressRequest,
    AddressResponse,
    PersonRequest,
    PersonResponse,
    ProfileRequest,
    ProfileResponse,
} from "../../person/types/person";
export type { PageResponse } from "../../../lib/apiTypes";

export type PersonCreateRequest = PersonRequest;
export type ProfileCreateRequest = ProfileRequest;
export type AddressCreateRequest = AddressRequest;

export interface OwnerCreateRequest {
    person: PersonRequest;
    profile: ProfileRequest;
    address: AddressRequest;
}

export type OwnerUpdateRequest = OwnerCreateRequest;

export interface OwnerResponse {
    uuid: string;
    person: PersonResponse;
    profile: ProfileResponse;
    address: AddressResponse;
}

export type OwnerPageRequest = PageRequest & {
    sortBy?: "createdDate" | "lastModifiedDate";
};
