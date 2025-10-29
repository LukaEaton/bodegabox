import { RequestService } from "../services";
import { Category } from "../types";

const apiBaseUrl = import.meta.env.VITE_API_URL;

const CategoryService = {
    async getCategories(): Promise<Category[]> {
        try {
            const categories = await RequestService.apiRequest<Category[]>(`${apiBaseUrl}/categories/`);
            return categories;
        } catch (error) {
            console.error("Error fetching categories:", error);
            return [];
        }
    }
}

export default CategoryService;