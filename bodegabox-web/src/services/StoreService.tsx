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
    }
}

export default StoreService;