import { useEffect, useState } from "react";
import { Accordion, DropdownSelect } from "../components";
import { IngredientCard } from "../components/IngredientCard";
import PullToRefresh from "../components/PullToRefresh";
import IngredientService, { Ingredient, PendingIngredient } from "../services/IngredientService";
import StoreService from "../services/StoreService";
import CategoryService from "../services/CategoryService";
import FloatingButton from "../components/FloatingButton";
import { FaPlus } from "react-icons/fa";
import AddIngredientModal from "../components/AddIngredientModal";

export function ShoppingListPage() {

	const [expandAll, setExpandAll] = useState<boolean | null>(true);
	const [addIngredientModalOpen, setAddIngredientModalOpen] = useState<boolean>(false);
	const [stores, setStores] = useState<Array<{ value: number | null; label: string }>>([]);
	const [selectedStore, setSelectedStore] = useState<number | null>(null);
	const [categories, setCategories] = useState<Array<{ id: number | null; name: string }>>([]);
	const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
	const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);

	const getShoppingList = () => {
		IngredientService.getSavedIngredients().then(ingredients =>
			setAllIngredients(ingredients)
		);
	};

	const handleAddIngredient = (ingredient: PendingIngredient) => {
		IngredientService.addIngredient(ingredient).then(() => {
			getShoppingList();
			setAddIngredientModalOpen(false);
		});	
	};

	useEffect(() => {
		
		getShoppingList();

		StoreService.getStores().then(storesList =>
			storesList?.map(store => ({ value: store.id, label: store.name }))
		).then(storesList =>
			setStores([{ value: null, label: "Select Store..." }, ...storesList])
		);

		CategoryService.getCategories().then(categoriesList =>
			setCategories(categoriesList)
		);

	}, []);

	useEffect(() => {
		setFilteredIngredients(allIngredients?.filter(ingredient =>
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
				/>
			</div>
			<div style={{ marginTop: "20px" }}>
				<PullToRefresh onRefresh={() => getShoppingList()}>
					{categories.map(category => {
						const categoryIngredients = filteredIngredients?.filter(
							ingredient => ingredient.categoryId == category.id
						);
						return (
							<Accordion key={category.id} title={category.name}
								forceExpand={expandAll}>
								<ul style={{ margin: 0, paddingLeft: "45px" }}>
									{categoryIngredients?.map(ingredient => (
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
				</PullToRefresh>
            </div>
			<FloatingButton onClick={() => setAddIngredientModalOpen(true)}>
				<FaPlus size={24} />
			</FloatingButton>
			<AddIngredientModal 
				isOpen={addIngredientModalOpen}
				onClose={() => setAddIngredientModalOpen(false)}
				onAdd={handleAddIngredient}
			/>
		</>
	);
}