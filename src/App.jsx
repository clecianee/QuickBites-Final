import { Routes, Route } from "react-router-dom";

import AuthPage from "./pages/AuthPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import MyRecipesPage from "./pages/MyRecipesPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-recipes"
        element={
          <ProtectedRoute>
            <MyRecipesPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;