import { Navigation } from "./components/";
import { Routes, Route, Navigate } from "react-router-dom";
import { ShoppingListPage, RecipesPage, ExpensesPage, SettingsPage, MealPlanPage } from "./views/";

export default function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/list" element={<ShoppingListPage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/meal-plan" element={<MealPlanPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/list" replace />} />
      </Routes>
    </>
  );
}
