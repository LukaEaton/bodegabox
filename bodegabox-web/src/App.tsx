import { Navigation } from "./components/";
import { Routes, Route, Navigate } from "react-router-dom";
import { ShoppingListPage, RecipesPage, ExpensesPage, SettingsPage, MealPlanPage } from "./views/";
import { AlertProvider } from "./context";

export default function App() {
  return (
    <AlertProvider>
      <Routes>
        <Route path="/list" element={<ShoppingListPage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/meal-plan" element={<MealPlanPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/list" replace />} />
      </Routes>
      <Navigation />
    </AlertProvider>
  );
}
