import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/RecipeDetail.css";
import FoodItem from "../atoms/FoodItem.jsx"; // Importujeme FoodItem komponentu
import { getDeclinedUnit } from "../utils/units.js"; // Importujeme funkci pro skloňování jednotek

const RecipeDetail = () => {
    const { category, recipeName } = useParams(); // Kategorie + název receptu z URL
    const [portionCount, setPortionCount] = useState(2); // Počet porcí
    const [recipe, setRecipe] = useState(null);
    const [adjustedIngredients, setAdjustedIngredients] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");

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

    // Pokud recept není načtený, zavoláme funkci pro jeho načítání
    if (!recipe) {
        fetchRecipe(); // Načteme recept při renderování
        return <p>Načítám recept...</p>;
    }

    // Funkce pro přepočet ingrediencí podle porcí
    const adjustIngredientsForPortions = (ingredients, currentPortions, targetPortions) => {
        return ingredients.map(ingredient => {
            if (ingredient.quantity !== null && ingredient.quantity !== undefined) {
                return {
                    ...ingredient,
                    quantity: ingredient.quantity * (targetPortions / currentPortions),
                    unit: normalizeUnit(ingredient.unit), // Ujistíme se, že jednotka je v základním tvaru pro ukládání
                };
            }
            return ingredient; // Return the ingredient unchanged if quantity is null or undefined
        });
    };

    // Funkce pro normalizaci jednotek (zajistí, že jsou v základním tvaru pro localStorage)
    const normalizeUnit = (unit) => {
        switch (unit) {
            case "lžička":
                return "lžička";
            case "lžíce":
                return "lžíce";
            case "hrst":
                return "hrst";
            case "plátek":
                return "plátek";
            case "stroužek":
                return "stroužek";
            case "konzerva":
                return "konzerva";
            case "lístek":
                return "lístek";
                case "kulička":
                return "kulička";
            default:
                return unit; // Pokud jednotka není v seznamu, vrátíme původní
        }
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

    // Funkce pro uložení ingrediencí do localStorage
    const saveToCart = () => {
        const storedIngredients = JSON.parse(localStorage.getItem("cart")) || [];
        const updatedIngredients = [...storedIngredients, ...adjustedIngredients];
        localStorage.setItem("cart", JSON.stringify(updatedIngredients)); // Uložení nových ingrediencí do localStorage
        setToastMessage("Ingredience byly přidány do nákupního seznamu.");
        setToastType("success");
        setShowToast(true);

        setTimeout(() => {
            setShowToast(false); // Skryjeme toast po 3 sekundách
        }, 3000);
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
                {/* Kontrola, zda adjustedIngredients existují a nejsou prázdné */}
                {adjustedIngredients && adjustedIngredients.length > 0 ? (
                    <ul>
                        {adjustedIngredients.map((ingredient, index) => (
                            <li key={index}>
                                {ingredient.name} {ingredient.quantity} {getDeclinedUnit(ingredient.unit, ingredient.quantity)}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Ingredience nejsou k dispozici.</p>
                )}
                <button className="cart-button" onClick={saveToCart}>Uložit do nákupního seznamu</button>

                <h2>Postup</h2>
                {/* Kontrola, zda recipe.instructions existují a nejsou prázdné */}
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
                    Zpět
                </a>
                {/* Toast notifikace */}
                <div className={`toast ${showToast ? 'show' : ''} ${toastType}`}>
                    {toastMessage}
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;
