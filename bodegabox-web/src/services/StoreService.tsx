export interface Store {
  id: number;
  name: string;
}

const StoreService = {
    async fetchStores(): Promise<Store[]> {
        // TODO: Fetch stores from backend
		const storesList = [
			{ id: 1, name: "Walmart" },
			{ id: 2, name: "Target" },
			{ id: 3, name: "Whole Foods" }
		];
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return storesList;
    }

}

export default StoreService;