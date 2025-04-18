import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import CategoryPage from "./pages/CategoryPage";
import RecipeDetail from "./pages/RecipeDetail";
import HeaderLink from "./atoms/HeaderLink.jsx";
import AddRecipePage from "./pages/NewRecipe.jsx";
import Cart from "./pages/Cart.jsx";

const App = () => {
    return (
        <Router>
            <HeaderLink />
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/:category" element={<CategoryPage />} />
                <Route path="/:category/:recipeName" element={<RecipeDetail />} />
                <Route path="/new-recipe" element={<AddRecipePage />} />
                <Route path="/cart" element={<Cart/>} />
            </Routes>
        </Router>
    );
};

export default App;
