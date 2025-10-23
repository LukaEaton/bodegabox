import { apiRequest } from "./RequestService";

export interface Store {
  id: number;
  name: string;
}

const apiBaseUrl = import.meta.env.VITE_API_URL;

const StoreService = {
    async getStores(): Promise<Store[]> {
        try {
            const stores = await apiRequest<Store[]>(`${apiBaseUrl}/stores/`);
            return stores;
        } catch (error) {
            console.error("Error fetching stores:", error);
            return [];
        }
    }
}

export default StoreService;