import type { PageRequest } from "../../../lib/apiTypes";

export type Sex = "FEMALE" | "MALE" | "DIVERSE";
export type MedicalRecordType =
    | "CONSULTATION"
    | "PRESCRIPTION"
    | "VACCINATION"
    | "SURGERY"
    | "FOLLOW_UP"
    | "OTHER";

export interface PetRequest {
    name: string;
    color?: string | null;
    marks?: string | null;
    sex: Sex;
    birthDate: string | null;
    speciesUuid: string;
    ownerUuid: string;
}

export interface PetResponse {
    uuid: string;
    name: string;
    color: string | null;
    marks: string | null;
    sex: Sex;
    birthDate: string | null;
    species: string;
}

export interface SpeciesRequest {
    name: string;
    code: string;
    origin?: string | null;
    description?: string | null;
}

export interface SpeciesResponse {
    uuid: string;
    name: string;
    code: string;
    origin: string | null;
    description: string | null;
}

export interface MedicalRecordResponse {
    uuid: string;
    petUuid: string;
    petName: string;
    visitUuid: string | null;
    vetUuid: string | null;
    vetFullName: string | null;
    type: MedicalRecordType;
    title: string | null;
    diagnosis: string | null;
    clinicalNotes: string | null;
    treatmentPlan: string | null;
    prescription: string | null;
    followUpRequired: boolean;
    followUpDate: string | null;
    vaccinationDetails: string | null;
    surgeryDetails: string | null;
    createdDate: string;
}

export type PetPageRequest = PageRequest & {
    sortBy?: "createdDate" | "lastModifiedDate";
};
