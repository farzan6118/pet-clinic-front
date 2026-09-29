import { api } from "../../../lib/api";
import type { MedicalRecordResponse } from "../../pet/types/pet";

/** Medical records are exposed by pet UUID in the backend. */
export async function getMedicalRecordByPet(uuid: string): Promise<MedicalRecordResponse> {
    const response = await api.get<MedicalRecordResponse>(`/pets/${uuid}/medical-record`);
    return response.data;
}
