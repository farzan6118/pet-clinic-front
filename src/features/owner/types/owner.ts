// src/features/owner/types/owner.ts

export interface PersonCreateRequest {
    title?: string;
    firstName?: string;
    lastName?: string;
    nationalId?: string;
}

export interface ProfileCreateRequest {
    email: string;
    mobileNumber: string;
    birthDate?: string;
    photo?: string;
}

export interface AddressCreateRequest {
    title?: string;
    countryName: string;
    provinceName: string;
    cityName: string;
    buildingNumber: string;
    floor?: number;
    unitNumber?: string;
    address: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
    description?: string;
    defaultAddress: boolean;
}

export interface OwnerCreateRequest {
    person: PersonCreateRequest;
    profile: ProfileCreateRequest;
    address: AddressCreateRequest;
}