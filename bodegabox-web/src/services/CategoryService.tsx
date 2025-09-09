export interface Category {
  id: number;
  name: string;
}

const CategoryService = {
    async fetchStores(): Promise<Category[]> {
        // TODO: Fetch categories from backend
        const categoriesList = [
            { id: 1, name: "🥬Produce" },
            { id: 2, name: "🥛Dairy" },
            { id: 3, name: "🥖Bakery" },
            { id: 4, name: "🥩Meat" },
            { id: 5, name: "🥤Beverages" }
        ];
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return categoriesList;
    }

}

export default CategoryService;