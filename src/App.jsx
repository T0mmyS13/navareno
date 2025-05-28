import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import CategoryPage from "./pages/CategoryPage";
import RecipeDetail from "./pages/RecipeDetail";
import HeaderLink from "./atoms/HeaderLink.jsx";
import AddRecipePage from "./pages/NewRecipe.jsx";
import Cart from "./pages/Cart.jsx";
import loadCategoriesToLocalStorage from "./utils/loadCategoriesToLocalStorage.js";
import {ToastProvider} from "./utils/ToastNotify.jsx";
import Footer from "./atoms/Footer";

loadCategoriesToLocalStorage();

const App = () => {
    return (
        <Router>
            <ToastProvider>
            <HeaderLink />
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/:category" element={<CategoryPage />} />
                <Route path="/:category/:recipeName" element={<RecipeDetail />} />
                <Route path="/new-recipe" element={<AddRecipePage />} />
                <Route path="/cart" element={<Cart/>} />
            </Routes>
                <Footer />
            </ToastProvider>
        </Router>
    );
};

export default App;
