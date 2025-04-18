import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/RecipeDetail.css";
import FoodItem from "../atoms/FoodItem.jsx"; // Importujeme FoodItem komponentu

const RecipeDetail = () => {
    const { category, recipeName } = useParams(); // Kategorie + název receptu z URL
    const [portionCount, setPortionCount] = useState(2); // Počet porcí
    const [recipe, setRecipe] = useState(null);
    const [adjustedIngredients, setAdjustedIngredients] = useState([]);

    // Načítání dat přímo při renderování
    const fetchRecipe = () => {
        fetch(`/recipes/${category}.json`) // Dynamické načítání podle kategorie
            .then((response) => response.json())
            .then((data) => {
                const foundRecipe = data.find(
                    (r) => r.title.toLowerCase() === recipeName.toLowerCase()
                );
                if (foundRecipe) {
                    setRecipe(foundRecipe);
                    setAdjustedIngredients(foundRecipe.ingredients);
                }
            })
            .catch((error) => console.error("Chyba při načítání receptu:", error));
    };

    // Pokud recept není načtený, zavoláme funkci pro jeho načtení
    if (!recipe) {
        fetchRecipe(); // Načteme recept při renderování
        return <p>Načítám recept...</p>;
    }

    // Funkce pro přepočet ingrediencí podle porcí
    const adjustIngredientsForPortions = (ingredients, currentPortions, targetPortions) => {
        return ingredients.map(ingredient => ({
            ...ingredient,
            quantity: ingredient.quantity * (targetPortions / currentPortions),
        }));
    };

    // Zpracování změny počtu porcí
    const handlePortionChange = (e) => {
        const newPortionCount = e.target.value;
        setPortionCount(newPortionCount);

        if (recipe && recipe.ingredients) {
            const adjusted = adjustIngredientsForPortions(
                recipe.ingredients,
                2, // Předpokládáme, že původní počet porcí je 2
                newPortionCount // Nový počet porcí
            );
            setAdjustedIngredients(adjusted); // Uložíme přepočtené ingredience
        }
    };

    return (
        <div className="recipe-detail">
            {/* Používáme FoodItem pro detail receptu */}
            <FoodItem
                title={recipe.title}
                link={`/${category}/${recipeName}`}
                description={recipe.description}
                image={recipe.image}
                time={recipe.time}
                difficulty={recipe.difficulty}
                rating={recipe.rating}
            />

            <div className="recipe-content">
                <h2>Ingredience</h2>
                <label htmlFor="portion-count">Počet porcí:</label>
                <input
                    id="portion-count"
                    type="number"
                    value={portionCount}
                    onChange={handlePortionChange}
                    min="1"
                />
                {/* Zkontroluj, zda adjustedIngredients existují a nejsou prázdné */}
                {adjustedIngredients && adjustedIngredients.length > 0 ? (
                    <ul>
                        {adjustedIngredients.map((ingredient, index) => (
                            <li key={index}>
                                {ingredient.name}: {ingredient.quantity} {ingredient.unit}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Ingredience nejsou k dispozici.</p>
                )}

                <h2>Postup</h2>
                {/* Zkontroluj, zda instructions existují a nejsou prázdné */}
                {recipe.instructions && recipe.instructions.length > 0 ? (
                    <ol>
                        {recipe.instructions.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                ) : (
                    <p>Postup není k dispozici.</p>
                )}


                <a href={`/${category}`} className="back-button">
                    Zpět na {category}
                </a>
            </div>
        </div>
    );
};

export default RecipeDetail;
