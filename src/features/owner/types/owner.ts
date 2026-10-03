import type {
    AddressRequest,
    AddressResponse,
    PersonRequest,
    PersonResponse,
    ContactRequest,
    ContactResponse,
} from "../../person/types/person";
import type { PageRequest } from "../../../lib/apiTypes";

export type {
    AddressRequest,
    AddressResponse,
    PersonRequest,
    PersonResponse,
    ContactRequest,
    ContactResponse,
} from "../../person/types/person";
export type { PageResponse } from "../../../lib/apiTypes";

export type PersonCreateRequest = PersonRequest;
export type ContactCreateRequest = ContactRequest;
export type AddressCreateRequest = AddressRequest;

export interface OwnerCreateRequest {
    person: PersonRequest;
    contact: ContactRequest;
    address: AddressRequest;
}

export type OwnerUpdateRequest = OwnerCreateRequest;

export interface OwnerResponse {
    uuid: string;
    person: PersonResponse;
    contact: ContactResponse;
    address: AddressResponse;
}

export type OwnerPageRequest = PageRequest & {
    sortBy?: "createdDate" | "lastModifiedDate";
};
