import { useState } from "react";
import { DropdownSelect } from "../components";

export function ShoppingListPage() {

	const [ selectedList, setSelectedList ] = useState<number | null>(null);

	// TODO: Fetch shopping lists from backend
	const shoppingLists = [
		{ value: 1, label: "Groceries" },
		{ value: 2, label: "Electronics" },
		{ value: 3, label: "Clothing" }
	];

	return (
		<>
			<DropdownSelect 
				options={shoppingLists}
				value={selectedList}
				onChange={setSelectedList}
				placeholder="Select a shopping list"
			/>
			<div>lists</div>
		</>
	);
}