import { RequestService } from "../services";
import { Store } from "../types";

const apiBaseUrl = import.meta.env.VITE_API_URL;

const StoreService = {
    async getStores(): Promise<Store[]> {
        try {
            const stores = await RequestService.apiRequest<Store[]>(`${apiBaseUrl}/stores/`);
            return stores;
        } catch (error) {
            console.error("Error fetching stores:", error);
            return [];
        }
    },

    async searchStores(query: string): Promise<Store[]> {
        return await RequestService.apiRequest<Store[]>(`${apiBaseUrl}/stores/search?q=${encodeURIComponent(query)}`);
    },

    async updateStore(data: Store): Promise<void> {
        await RequestService.apiRequest<void>(`${apiBaseUrl}/stores/`, {
            method: "PUT",
            body: data,
        });
    },

    async createStore(data: Partial<Store>): Promise<void> {
        await RequestService.apiRequest<void>(`${apiBaseUrl}/stores/`, {
            method: "POST",
            body: data,
        });
    },

    async deleteStore(id: number): Promise<void> {
        await RequestService.apiRequest<void>(`${apiBaseUrl}/stores/${id}/`, {
            method: "DELETE"
        });
    }
}

export default StoreService;