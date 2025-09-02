import { useEffect, useState } from "react";
import { Accordion, DropdownSelect } from "../components";

export function ShoppingListPage() {

	const [expandAll, setExpandAll] = useState<boolean | null>(true);
	const [selectedStore, setSelectedStore] = useState<number | null>(null);
	const [ingredients, setIngredients] = useState<Array<{
		id: number;
		name: string;
		categoryId: number;
		storeId: number;
	}>>([]);

	// TODO: Fetch stores from backend
	const stores = [
		{ id: 1, name: "Walmart" },
		{ id: 2, name: "Target" },
		{ id: 3, name: "Whole Foods" }
	].map(store => ({
		value: store.id,
		label: store.name
	}));
	const storeOptions = [
		{ value: null, label: "Select Store..." },
		...stores
	];

	// TODO: Fetch categories from backend
	const categories = [
		{ id: 1, name: "🥬Produce" },
		{ id: 2, name: "🥛Dairy" },
		{ id: 3, name: "🥖Bakery" },
		{ id: 4, name: "🥩Meat" },
		{ id: 5, name: "🥤Beverages" }
	];

	// TODO: Fetch ingredients from backend
	const allIngredients = [
		{ id: 1, name: "Apples", categoryId: 1, storeId: 1 },
		{ id: 2, name: "Bananas", categoryId: 1, storeId: 2 },
		{ id: 3, name: "Carrots", categoryId: 1, storeId: 3 },
		{ id: 4, name: "Milk", categoryId: 2, storeId: 1 },
		{ id: 5, name: "Cheese", categoryId: 2, storeId: 2 },
		{ id: 6, name: "Bread", categoryId: 3, storeId: 3 },
		{ id: 7, name: "Chicken", categoryId: 4, storeId: 1 },
		{ id: 8, name: "Beef", categoryId: 4, storeId: 2 },
		{ id: 9, name: "Soda", categoryId: 5, storeId: 1 },
		{ id: 10, name: "Juice", categoryId: 5, storeId: 3 }
	];

	useEffect(() => {
		setIngredients(allIngredients.filter(ingredient =>
			selectedStore ? ingredient.storeId == selectedStore : true
		));
	}, [selectedStore]);

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
					options={storeOptions}
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
                    const categoryIngredients = ingredients.filter(
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
									><h4 style={{ margin: "5px" }}>{ingredient.name}</h4></li>
                                ))}
                            </ul>
                        </Accordion>
                    );
                })}
            </div>
		</>
	);
}