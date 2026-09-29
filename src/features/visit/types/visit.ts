import type { PageRequest } from "../../../lib/apiTypes";
import type { MedicalRecordType } from "../../pet/types/pet";

export type VisitType = "ONLINE" | "ONSITE" | "OFFSITE";
export type VisitStatus = "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";

export interface VisitRequest {
    petUuid: string;
    vetUuid: string;
    visitDate: string;
    visitTime: string;
    visitType: VisitType;
    durationMinutes?: number | null;
    description?: string | null;
}

export interface RescheduleVisitRequest {
    visitDate: string;
    visitTime: string;
    visitType?: VisitType | null;
    description?: string | null;
    reason?: string | null;
}

export interface CompleteVisitRequest {
    diagnosis: string;
    notes?: string | null;
    recordType?: MedicalRecordType | null;
    prescription?: string | null;
    treatmentPlan?: string | null;
    followUpRequired: boolean;
    followUpDate?: string | null;
    vaccinationDetails?: string | null;
    surgeryDetails?: string | null;
}

export interface VisitResponse {
    uuid: string;
    petUuid: string;
    petName: string;
    species: string;
    ownerFullName: string;
    vetUuid: string;
    vetFullName: string;
    visitDateFrom: string;
    visitDateTo: string;
    visitType: VisitType;
    roomUuid: string | null;
    description: string | null;
    status: VisitStatus;
}

export interface VisitSearchRequest extends PageRequest {
    visitDateFrom?: string;
    visitDateTo?: string;
    createdDateFrom?: string;
    createdDateTo?: string;
    vetUuid?: string;
    petUuid?: string;
    roomUuid?: string;
    sortBy?: "startTime" | "endTime" | "createdDate" | "status" | "visitType" | "lastModifiedDate";
}

export interface DurationTemplateRequest {
    name: string;
    durationMinutes: number;
    description?: string | null;
}

export interface DurationTemplateResponse {
    uuid: string;
    name: string;
    durationMinutes: number;
    description: string | null;
}
