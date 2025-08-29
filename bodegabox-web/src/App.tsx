import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { Navigation } from "./components/";
import { Routes, Route, Navigate } from "react-router-dom";
import { ShoppingList } from "./views/";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Navigation />
      <Routes>
        <Route path="/list" element={<ShoppingList />} />
        <Route path="*" element={<Navigate to="/list" replace />} />
      </Routes>
    </MantineProvider>
  );
}
