import { useEffect, useState } from "react";
import { 
	Accordion, 
	DropdownSelect, 
	PullToRefresh, 
	IngredientCard, 
	FloatingButton, 
	IngredientModal,
	TabHeader
} from "../components";
import { IngredientService, StoreService, CategoryService } from "../services";
import { Ingredient, PendingIngredient, Store, Category } from "../types";
import { FaPlus } from "react-icons/fa";
import { useAlert } from "../context/AlertContext";

export function ShoppingListPage() {

	const [expandAll, setExpandAll] = useState<boolean | null>(true);
	const [addIngredientModalOpen, setAddIngredientModalOpen] = useState<boolean>(false);
	const [editIngredient, setEditIngredient] = useState<Ingredient | null>(null);
	const [stores, setStores] = useState<Store[]>([]);
	const [selectedStore, setSelectedStore] = useState<number | null>(null);
	const [categories, setCategories] = useState<Category[]>([]);
	const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
	const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);
	const { setAlert } = useAlert();

	const getShoppingList = () => {
		IngredientService.getSavedIngredients()
			.then(ingredients =>
				setAllIngredients(ingredients)
			)
			.catch(error => console.error(error));
	};

	const getStores = () => {
		StoreService.getStores()
			.then(storesList => {
				setStores(storesList);
			})
			.catch(error => console.error(error));
	};

	const getCategories = () => {
		CategoryService.getCategories()
			.then(categoriesList =>
			setCategories(categoriesList)
			)
			.catch(error => console.error(error));
	}

	const handleAddIngredient = (ingredient: PendingIngredient) => {
		IngredientService.addIngredientToList(ingredient).then(() => {
			getShoppingList();
			setAddIngredientModalOpen(false);
			setAlert("Ingredient Added!", "Success");
		})
		.catch(error => {
			if ((error as any).status === 409) {
				setAlert("Ingredient is already on the list!");
				console.log((error as any).message);
			}
			else {
				setAlert((error as any).message);
			}
		});	
	};

	const handleEditIngredient = (ingredient: PendingIngredient) => {
		IngredientService.editListIngredient(ingredient).then(() => {
			getShoppingList();
			setAddIngredientModalOpen(false);
			setEditIngredient(null);
			setAlert("Ingredient Edited!", "Success");
		})
		.catch(error => {
			if ((error as any).status === 409) {
				setAlert("Ingredient is purchased or not on the list!");
			}
			else {
				setAlert((error as any).message);
			}
		});	
	}

	const handlePurchaseIngredient = (ingredientId: number) => {
		IngredientService.purchase(ingredientId).then(() => {
			getShoppingList();
		});
	};

	const handleRevertPurchaseIngredient = (ingredientId: number) => {
		IngredientService.revertPurchase(ingredientId).then(() => {
			getShoppingList();
		});
	};

	useEffect(() => {
		getShoppingList();
		getStores();
		getCategories();
	}, []);

	useEffect(() => {
		setFilteredIngredients(allIngredients?.filter(ingredient =>
			selectedStore ? ingredient.storeId == selectedStore : true
		));
	}, [selectedStore, allIngredients]);

	return (
		<div className="tab">
			<TabHeader title="Shopping List"></TabHeader>
			<div style={{ flex: 1, overflowY: "auto", paddingTop: "10px", padding: "10px 10px" }}>
				<div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
					<DropdownSelect 
						options={[ {value: null, label: "Select Store..."}, ...stores.map(store => ({value: store.id, label: store.name}))]}
						value={selectedStore}
						onChange={setSelectedStore}
						placeholder="Select Store..."
						className="flex-grow"
					/>
					<button
						className="secondary-button-color"
						style={{
							padding: "5px 10px",
							borderRadius: "15px",
							border: "none",
							height: "fit-content",
							fontWeight: "bold"
						}}
						onClick={() => setExpandAll(!expandAll)}
					>
						{expandAll ? "Collapse All" : "Expand All"}
					</button>
				</div>
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
										><IngredientCard 
											ingredient={ingredient}
											onEdit={(ingredient) => {
												setEditIngredient(ingredient);
												setAddIngredientModalOpen(true);
											}}
											onPurchase={handlePurchaseIngredient}
											onRevertPurchase={handleRevertPurchaseIngredient}
										/></li>
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
								><IngredientCard 
									ingredient={ingredient}
									onEdit={(ingredient) => {
										setEditIngredient(ingredient);
										setAddIngredientModalOpen(true);
									}}
									onPurchase={handlePurchaseIngredient}
									onRevertPurchase={handleRevertPurchaseIngredient}
								/></li>
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
								><IngredientCard 
									ingredient={ingredient}
									onEdit={(ingredient) => {
										setEditIngredient(ingredient);
										setAddIngredientModalOpen(true);
									}}
									onPurchase={handlePurchaseIngredient}
									onRevertPurchase={handleRevertPurchaseIngredient}
								/></li>
							))}
						</ul>
					</Accordion>
				</PullToRefresh>
            </div>
			<FloatingButton onClick={() => setAddIngredientModalOpen(true)}>
				<FaPlus size={24} />
			</FloatingButton>
			<IngredientModal 
				isOpen={addIngredientModalOpen}
				onClose={() => {setAddIngredientModalOpen(false); setEditIngredient(null);}}
				ingredient={editIngredient}
				onAdd={handleAddIngredient}
				onEdit={handleEditIngredient}
				categories={categories.map(category => ({ value: category.id, label: category.name }))}
				stores={stores.map(store => ({ value: store.id, label: store.name }))}
			/>
		</div>
	);
}