import React, { useState } from "react";
import "../styles/Cart.css"; // Import CSS pro tuto komponentu
import { getDeclinedUnit } from "../utils/units.js"; // Importujeme funkci pro skloňování jednotek

const ShoppingList = () => {
    const [mergedIngredients, setMergedIngredients] = useState([]);

    // Funkce pro sloučení ingrediencí a jejich agregaci
    const mergeIngredients = (ingredients) => {
        const map = new Map();

        ingredients.forEach(({ name, quantity, unit }) => {
            if (quantity === null || quantity === undefined) {
                return; // Ignorujeme ingredience s null nebo undefined množstvím
            }

            const key = `${name}-${unit}`;
            if (map.has(key)) {
                map.get(key).quantity += Number(quantity);
            } else {
                map.set(key, { name, quantity: Number(quantity), unit });
            }
        });

        return Array.from(map.values());
    };

    // Funkce pro načtení ingrediencí z localStorage
    const getIngredientsFromLocalStorage = () => {
        const stored = localStorage.getItem("cart");
        return stored ? JSON.parse(stored) : [];
    };

    // Načteme ingredience při renderování
    const storedIngredients = getIngredientsFromLocalStorage();
    const merged = mergeIngredients(storedIngredients); // Sloučíme ingredience a agregujeme je

    // Funkce pro vysypání košíku
    const handleClearCart = () => {
        localStorage.removeItem("cart");
        setMergedIngredients([]); // Vyprázdnění seznamu ingrediencí v UI
    };

    // Funkce pro tisk seznamu
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="shopping-list-container">
            <h1>Nákupní seznam</h1>
            {merged.length === 0 ? (
                <p>Seznam je prázdný.</p>
            ) : (
                <ul>
                    {merged.map((item, index) => (
                        item.quantity !== null && item.quantity !== undefined && (
                            <li key={index}>
                                {item.name} {item.quantity} {getDeclinedUnit(item.unit, item.quantity)}
                            </li>
                        )
                    ))}
                </ul>
            )}
            {merged.length > 0 && (
                <div className="buttons-container">
                    <button onClick={handlePrint}>Tisknout</button>
                    <button onClick={handleClearCart}>Vysypat košík</button>
                </div>
            )}
        </div>
    );
};

export default ShoppingList;
