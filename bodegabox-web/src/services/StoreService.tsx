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
    }
}

export default StoreService;