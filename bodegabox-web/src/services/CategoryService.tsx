import { apiRequest } from "./RequestService";

export interface Category {
  id: number | null;
  name: string;
}

const apiBaseUrl = import.meta.env.VITE_API_URL;

const CategoryService = {
    async getCategories(): Promise<Category[]> {
        try {
            const categories = await apiRequest<Category[]>(`${apiBaseUrl}/categories/`);
            return categories;
        } catch (error) {
            console.error("Error fetching categories:", error);
            return [];
        }
    }
}

export default CategoryService;