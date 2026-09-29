import type { PageRequest } from "../../../lib/apiTypes";
import type { AddressRequest, AddressResponse } from "../../person/types/person";

export interface ClinicRequest {
    name: string;
    code: number;
    address: AddressRequest;
    active: boolean;
}

export interface ClinicResponse {
    uuid: string;
    name: string;
    code: number;
    address: AddressResponse;
    active: boolean;
}

export interface RoomTypeRequest {
    name: string;
    description?: string | null;
}

export interface RoomTypeResponse {
    uuid: string;
    name: string;
    description: string | null;
    status: "UNINITIALIZED" | "ACTIVE" | "INACTIVE" | "DELETED";
}

export interface RoomRequest {
    name: string;
    code: string;
    roomTypeUuid: string;
    clinicUuid: string;
    active: boolean;
}

export interface RoomResponse {
    uuid: string;
    name: string;
    code: string;
    roomType: RoomTypeResponse;
    active: boolean | null;
    clinicUuid: string;
}

export type ClinicPageRequest = PageRequest & {
    sortBy?: "createdDate" | "lastModifiedDate";
};
