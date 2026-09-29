/** Person, profile, and address DTOs embedded in owner and vet APIs. */
export interface PersonRequest {
    title?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    nationalId?: string | null;
}

export interface PersonResponse {
    title: string | null;
    firstName: string | null;
    lastName: string | null;
    nationalId: string | null;
}

export interface ProfileRequest {
    email: string;
    mobileNumber: string;
    birthDate?: string | null;
    photo?: string | null;
}

export interface ProfileResponse {
    email: string;
    mobileNumber: string;
    birthDate: string | null;
    photo: string | null;
}

export interface AddressRequest {
    title?: string | null;
    countryName: string;
    provinceName: string;
    cityName: string;
    buildingNumber: string;
    floor?: number | null;
    unitNumber?: string | null;
    address: string;
    postalCode?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    description?: string | null;
    defaultAddress: boolean;
}

export interface AddressResponse {
    title: string | null;
    countryName: string;
    provinceName: string;
    cityName: string;
    buildingNumber: string;
    floor: number | null;
    unitNumber: string | null;
    address: string;
    postalCode: string | null;
    latitude: number | null;
    longitude: number | null;
    description: string | null;
    defaultAddress: boolean;
}
