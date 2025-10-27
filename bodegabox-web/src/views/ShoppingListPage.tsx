import { useEffect, useState } from "react";
import { 
	Accordion, 
	DropdownSelect, 
	PullToRefresh, 
	IngredientCard, 
	FloatingButton, 
	AddIngredientModal 
} from "../components";
import { IngredientService, StoreService, CategoryService } from "../services";
import { Ingredient, PendingIngredient } from "../types";
import { FaPlus } from "react-icons/fa";
import { useAlert } from "../context/AlertContext";

export function ShoppingListPage() {

	const [expandAll, setExpandAll] = useState<boolean | null>(true);
	const [addIngredientModalOpen, setAddIngredientModalOpen] = useState<boolean>(false);
	const [stores, setStores] = useState<Array<{ value: number | null; label: string }>>([]);
	const [selectedStore, setSelectedStore] = useState<number | null>(null);
	const [categories, setCategories] = useState<Array<{ id: number | null; name: string }>>([]);
	const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
	const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);
	const { setAlert } = useAlert();

	const getShoppingList = () => {
		IngredientService.getSavedIngredients().then(ingredients =>
			setAllIngredients(ingredients)
		);
	};

	const handleAddIngredient = (ingredient: PendingIngredient) => {
		IngredientService.addIngredient(ingredient).then(() => {
			getShoppingList();
			setAddIngredientModalOpen(false);
		})
		.catch(error => {
			if ((error as any).status === 409) {
				setAlert("Ingredient is already on the list!");
				return;
			}
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
		<div className="tab">
			<div style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "#272727ff", padding: "10px 20px 15px 20px" }}>
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
					margin: "0px"
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
				<div style={{ marginTop: "10px" }}>
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
			</div>
			<div style={{ flex: 1, overflowY: "auto", paddingTop: "10px", padding: "10px 10px" }}>
				<PullToRefresh onRefresh={() => getShoppingList()}>
					{categories.map(category => {
						const categoryIngredients = filteredIngredients?.filter(
							ingredient => ingredient.categoryId == category.id && ingredient.valid
						);
						return (
							<Accordion key={category.id} title={category.name}
								forceExpand={expandAll} style={{ marginBottom: "20px" }}>
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
					<Accordion title="Uncategorized" forceExpand={expandAll} style={{ marginBottom: "20px" }}>
						<ul style={{ margin: 0, paddingLeft: "45px" }}>
							{filteredIngredients?.filter(ingredient => !ingredient.categoryId && ingredient.valid).map(ingredient => (
								<li 
									style={{ listStyleType: "none" }}
									key={ingredient.id}
								><IngredientCard ingredient={ingredient} /></li>
							))}
						</ul>
					</Accordion>
					<hr/>
					<Accordion title="Recently Purchased" forceExpand={expandAll} style={{ paddingBottom: "0px" }}>
						<ul style={{ margin: 0, paddingLeft: "45px" }}>
							{filteredIngredients?.filter(ingredient => !ingredient.valid).map(ingredient => (
								<li 
									style={{ listStyleType: "none" }}
									key={ingredient.id}
								><IngredientCard ingredient={ingredient} /></li>
							))}
						</ul>
					</Accordion>
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
		</div>
	);
}