import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/RecipeDetail.css";
import FoodItem from "../atoms/FoodItem.jsx"; // Komponenta pro zobrazení základních údajů o receptu
import { getDeclinedUnit } from "../utils/units.js"; // Funkce pro správné skloňování jednotek

const RecipeDetail = () => {
    // Načteme parametry z URL (kategorie a název receptu)
    const { category, recipeName } = useParams();

    // Stavy pro správu dat a UI
    const [portionCount, setPortionCount] = useState(2); // Výchozí počet porcí je 2
    const [recipe, setRecipe] = useState(null); // Data receptu
    const [adjustedIngredients, setAdjustedIngredients] = useState([]); // Upravené ingredience podle počtu porcí
    const [showToast, setShowToast] = useState(false); // Toast notifikace
    const [toastMessage, setToastMessage] = useState(""); // Zpráva toastu
    const [toastType, setToastType] = useState("success"); // Typ toastu (úspěch/chyba)

    // Funkce pro načítání dat receptu podle kategorie a názvu
    const fetchRecipe = () => {
        fetch(`/recipes/${category}.json`)
            .then((response) => response.json())
            .then((data) => {
                const foundRecipe = data.find(
                    (r) => r.title.toLowerCase() === recipeName.toLowerCase()
                );
                if (foundRecipe) {
                    setRecipe(foundRecipe);
                    setAdjustedIngredients(foundRecipe.ingredients); // Nastavíme i základní ingredience
                }
            })
            .catch((error) => console.error("Chyba při načítání receptu:", error));
    };

    // Pokud recept není načtený, spustíme jeho načítání
    if (!recipe) {
        fetchRecipe();
        return <p>Načítám recept...</p>; // Jednoduché loading hlášení
    }

    // Funkce pro přepočet ingrediencí podle změny počtu porcí
    const adjustIngredientsForPortions = (ingredients, currentPortions, targetPortions) => {
        return ingredients.map(ingredient => {
            if (ingredient.quantity !== null && ingredient.quantity !== undefined) {
                return {
                    ...ingredient,
                    quantity: ingredient.quantity * (targetPortions / currentPortions),
                    unit: normalizeUnit(ingredient.unit), // Normalizujeme jednotku
                };
            }
            return ingredient; // Pokud quantity chybí, vrátíme beze změny
        });
    };

    // Pomocná funkce pro normalizaci jednotek (aby se správně skloňovaly a ukládaly)
    const normalizeUnit = (unit) => {
        switch (unit) {
            case "lžička":
            case "lžíce":
            case "hrst":
            case "plátek":
            case "stroužek":
            case "konzerva":
            case "lístek":
            case "kulička":
                return unit;
            default:
                return unit; // Pokud není v seznamu, vrátíme jak je
        }
    };

    // Funkce na změnu počtu porcí (při změně inputu)
    const handlePortionChange = (e) => {
        const newPortionCount = e.target.value;
        setPortionCount(newPortionCount);

        if (recipe && recipe.ingredients) {
            const adjusted = adjustIngredientsForPortions(
                recipe.ingredients,
                2, // Výchozí počet porcí je 2 (předpoklad)
                newPortionCount
            );
            setAdjustedIngredients(adjusted);
        }
    };

    // Funkce pro uložení ingrediencí do localStorage (nákupní seznam)
    const saveToCart = () => {
        const storedIngredients = JSON.parse(localStorage.getItem("cart")) || [];
        const updatedIngredients = [...storedIngredients, ...adjustedIngredients];
        localStorage.setItem("cart", JSON.stringify(updatedIngredients));

        // Nastavíme toast
        setToastMessage("Ingredience byly přidány do nákupního seznamu.");
        setToastType("success");
        setShowToast(true);

        // Toast zmizí po 3 sekundách
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    return (
        <div className="recipe-detail">
            {/* Základní informace o receptu */}
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
                {/* Ingredience sekce */}
                <h2>Ingredience</h2>

                {/* Input pro změnu počtu porcí */}
                <label htmlFor="portion-count">Počet porcí:</label>
                <input
                    id="portion-count"
                    type="number"
                    value={portionCount}
                    onChange={handlePortionChange}
                    min="1"
                />

                {/* Výpis ingrediencí */}
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

                {/* Tlačítko pro uložení ingrediencí */}
                <button className="cart-button" onClick={saveToCart}>
                    Uložit do nákupního seznamu
                </button>

                {/* Postup přípravy */}
                <h2>Postup</h2>
                {recipe.instructions && recipe.instructions.length > 0 ? (
                    <ol>
                        {recipe.instructions.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                ) : (
                    <p>Postup není k dispozici.</p>
                )}

                {/* Tlačítko Zpět */}
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
