import { api } from "../../../lib/api";

export async function getOwners() {
    const response = await api.get("/owners/page");
    return response.data;
}