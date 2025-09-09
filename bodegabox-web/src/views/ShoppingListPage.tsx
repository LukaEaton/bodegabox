import { useEffect, useState } from "react";
import { Accordion, DropdownSelect } from "../components";
import { IngredientCard } from "../components/IngredientCard";

export function ShoppingListPage() {

	const [expandAll, setExpandAll] = useState<boolean | null>(true);
	const [stores, setStores] = useState<Array<{ value: number | null; label: string }>>([]);
	const [selectedStore, setSelectedStore] = useState<number | null>(null);
	const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
	const [allIngredients, setAllIngredients] = useState<Array<{
		id: number;
		name: string;
		categoryId: number;
		storeId: number;
	}>>([]);
	const [filteredIngredients, setFilteredIngredients] = useState<Array<{
		id: number;
		name: string;
		categoryId: number;
		storeId: number;
	}>>([]);

	useEffect(() => {
		// TODO: Fetch ingredients from backend
		const allIngredientsList = [
			{ id: 1, name: "Apples", categoryId: 1, storeId: 1, description: "Fresh and crispy" },
			{ id: 2, name: "Bananas", categoryId: 1, storeId: 2 },
			{ id: 3, name: "Carrots", categoryId: 1, storeId: 3 },
			{ id: 4, name: "Milk", categoryId: 2, storeId: 1, description: "2% Fat" },
			{ id: 5, name: "Cheese", categoryId: 2, storeId: 2 },
			{ id: 6, name: "Bread", categoryId: 3, storeId: 3, description: "Whole grain" },
			{ id: 7, name: "Chicken", categoryId: 4, storeId: 1 },
			{ id: 8, name: "Beef", categoryId: 4, storeId: 2, description: "Grass-fed" },
			{ id: 9, name: "Soda", categoryId: 5, storeId: 1 },
			{ id: 10, name: "Juice", categoryId: 5, storeId: 3 }
		];
		setAllIngredients(allIngredientsList);

		// TODO: Fetch stores from backend
		const storesList = [
			{ id: 1, name: "Walmart" },
			{ id: 2, name: "Target" },
			{ id: 3, name: "Whole Foods" }
		].map(store => ({
			value: store.id,
			label: store.name
		}));
		setStores([{ value: null, label: "Select Store..." }, ...storesList]);

		// TODO: Fetch categories from backend
		const categoriesList = [
			{ id: 1, name: "🥬Produce" },
			{ id: 2, name: "🥛Dairy" },
			{ id: 3, name: "🥖Bakery" },
			{ id: 4, name: "🥩Meat" },
			{ id: 5, name: "🥤Beverages" }
		];
		setCategories(categoriesList);
	}, [])

	useEffect(() => {
		setFilteredIngredients(allIngredients.filter(ingredient =>
			selectedStore ? ingredient.storeId == selectedStore : true
		));
	}, [selectedStore, allIngredients]);

	return (
		<>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
				margin: "10px"
			 }}>
				<h1 style={{ margin: "0px" }}>Shopping List</h1>
				<button
					style={{
						padding: "5px 10px",
						borderRadius: "5px",
						height: "fit-content",
						background: "transparent",
					}}
					onClick={() => setExpandAll(!expandAll)}
				>
					{expandAll ? "Collapse All" : "Expand All"}
				</button>
			</div>
			<div style={{ margin: "20px 5px" }}>
				<DropdownSelect 
					options={stores}
					value={selectedStore}
					onChange={setSelectedStore}
					placeholder="Select Store..."
					backgroundColor="#3A3A3A"
					selectedBackgroundColor="#2e2e2eff"
					fontColor="#FFFFFF"
					borderColor="#555555"
					className="store-dropdown"
				/>
			</div>
			<div style={{ marginTop: "20px" }}>
                {categories.map(category => {
                    const categoryIngredients = filteredIngredients.filter(
                        ingredient => ingredient.categoryId == category.id
                    );
                    return (
                        <Accordion key={category.id} title={category.name}
							forceExpand={expandAll}>
                            <ul style={{ margin: 0, paddingLeft: "45px" }}>
                                {categoryIngredients.map(ingredient => (
                                    <li 
										style={{ 
											listStyleType: "none"
										}}
										key={ingredient.id}
									><IngredientCard ingredient={ingredient} /></li>
                                ))}
                            </ul>
                        </Accordion>
                    );
                })}
            </div>
		</>
	);
}