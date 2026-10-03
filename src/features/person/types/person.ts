/** Person, contact, and address DTOs embedded in owner and vet APIs. */
export interface PersonRequest {
    title?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    nationalId?: string | null;
    birthDate?: string | null;
    photo?: string | null;
}

export interface PersonResponse {
    title: string | null;
    firstName: string | null;
    lastName: string | null;
    nationalId: string | null;
    birthDate: string | null;
    photo: string | null;
}

export interface ContactRequest {
    email: string;
    mobileNumber: string;
    socialMedia?: string | null;
}

export interface ContactResponse {
    email: string;
    mobileNumber: string;
    socialMedia: string | null;
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
