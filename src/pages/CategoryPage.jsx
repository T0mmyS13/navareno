import React, { useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "../styles/CategoryPage.css";
import Food from "../atoms/Food.jsx";

// Komponenta pro stránku konkrétní kategorie receptů
const CategoryPage = () => {
    // Získání názvu kategorie z URL
    const { category } = useParams();
    const navigate = useNavigate();

    // Stav pro seznam receptů
    const [recipes, setRecipes] = useState([]);

    // Stav pro aktuálně vybrané kritérium řazení
    const [sortCriteria, setSortCriteria] = useState("");

    // Slovník pro překlad slugů kategorií na hezké názvy
    const categoryTitles = {
        "predkrmy": "Předkrmy",
        "polevky": "Polévky",
        "salaty": "Saláty",
        "hlavni-chody": "Hlavní chody",
        "dezerty": "Dezerty",
        "napoje": "Nápoje",
    };

    // Načítání receptů při změně kategorie
    useMemo(() => {
        fetch(`/recipes/${category}.json`)
            .then((response) => response.json())
            .then((data) => {
                // Aktualizace načtených receptů s uloženým hodnocením z localStorage
                const updatedRecipes = data.map((recipe) => {
                    const savedRating = localStorage.getItem(`rating-${recipe.title}`);
                    const savedVotes = localStorage.getItem(`votes-${recipe.title}`);
                    const averageRating = savedRating ? parseFloat(savedRating).toFixed(1) : recipe.rating;
                    const votes = savedVotes ? parseInt(savedVotes, 10) : recipe.ratingsCount;

                    return {
                        ...recipe,
                        rating: averageRating,
                        ratingsCount: votes,
                    };
                });
                setRecipes(updatedRecipes);
            })
            .catch((error) => console.error("Chyba při načítání receptů:", error));
    }, [category]);

    // Vytvoření seřazeného seznamu receptů na základě zvoleného kritéria
    const sortedRecipes = useMemo(() => {
        let sortedArray = [...recipes];
        if (sortCriteria === "rating") {
            sortedArray.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        } else if (sortCriteria === "difficulty") {
            sortedArray.sort((a, b) => a.difficulty - b.difficulty);
        } else if (sortCriteria === "time") {
            sortedArray.sort((a, b) => a.time - b.time);
        }
        return sortedArray;
    }, [recipes, sortCriteria]);

    // Funkce pro náhodné přesměrování na detail náhodného receptu
    const handleRandomRecipe = () => {
        if (sortedRecipes.length > 0) {
            const randomRecipe = sortedRecipes[Math.floor(Math.random() * sortedRecipes.length)];
            navigate(`/${category}/${randomRecipe.title.toLowerCase()}`);
        }
    };

    return (
        <div className="category-page">
            {/* Hero sekce */}
            <div className="hero">
                <img
                    src={`/images/${category}.jpg`}
                    alt={category}
                    className="hero-image"
                />
                <div className="hero-overlay">
                    <h1 className="main-title">{categoryTitles[category] || category}</h1>
                    <p className="subtitle">Objevte nejlepší recepty v kategorii {categoryTitles[category] || category}</p>
                </div>
            </div>

            {/* Ovládací prvky (zpět, náhodný recept, řazení) */}
            <div className="header-controls">
                <Link to={"/"} className="back-button">Zpět na hlavní stránku</Link>
                <div className="random-recipe-container">
                    <button className="random-recipe-button" onClick={handleRandomRecipe}>
                        Nevím, co si dám
                    </button>
                </div>
                <div className="sort-filter">
                    <select onChange={(e) => setSortCriteria(e.target.value)} value={sortCriteria}>
                        <option value="">Seřadit podle</option>
                        <option value="difficulty">Obtížnost</option>
                        <option value="time">Délka přípravy</option>
                        <option value="rating">Hodnocení</option>
                    </select>
                </div>
            </div>

            {/* Výpis receptů */}
            <div className="recipe-list">
                {sortedRecipes.map((recipe) => (
                    <Food
                        key={recipe.title}
                        {...recipe}
                        category={category}
                        rating={recipe.rating}
                        ratingsCount={recipe.ratingsCount}
                    />
                ))}
            </div>
        </div>
    );
};

export default CategoryPage;
