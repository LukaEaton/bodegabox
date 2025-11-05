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
    },

    async searchCategories(query: string): Promise<Category[]> {
        return await RequestService.apiRequest<Category[]>(`${apiBaseUrl}/categories/search?q=${encodeURIComponent(query)}`);
    },

    async updateCategory(data: Category): Promise<void> {
        await RequestService.apiRequest<void>(`${apiBaseUrl}/categories/`, {
            method: "PUT",
            body: data,
        });
    },

    async createCategory(data: Partial<Category>): Promise<void> {
        await RequestService.apiRequest<void>(`${apiBaseUrl}/categories/`, {
            method: "POST",
            body: data,
        });
    },

    async deleteCategory(id: number): Promise<void> {
        await RequestService.apiRequest<void>(`${apiBaseUrl}/categories/${id}`, {
            method: "DELETE"
        });
    }
}

export default CategoryService;