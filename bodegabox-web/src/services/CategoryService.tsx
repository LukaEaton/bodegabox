export interface Category {
  id: number | null;
  name: string;
}

const CategoryService = {
    async fetchCategories(): Promise<Category[]> {
        // TODO: Fetch categories from backend
        const categoriesList = [
            { id: 1, name: "🥬Produce" },
            { id: 2, name: "🥛Dairy" },
            { id: 3, name: "🥖Bakery" },
            { id: 4, name: "🥩Meat" },
            { id: 5, name: "🥤Beverages" },
            { id: null, name: "Uncategorized" }
        ];
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return categoriesList;
    }

}

export default CategoryService;