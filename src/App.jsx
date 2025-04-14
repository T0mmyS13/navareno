import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import CategoryPage from "./pages/CategoryPage";
import RecipeDetail from "./pages/RecipeDetail";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/:category" element={<CategoryPage />} />
                <Route path="/:category/:recipeName" element={<RecipeDetail />} />
            </Routes>
        </Router>
    );
};

export default App;
