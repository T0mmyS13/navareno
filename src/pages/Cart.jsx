import React, { useState } from "react";
import "../styles/Cart.css";
import { getDeclinedUnit } from "../utils/units.js";
import QRCode from "react-qr-code"; // QR kód knihovna

// Funkce na odstranění diakritiky
const removeDiacritics = (text) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const ShoppingList = () => {
    const [setMergedIngredients] = useState([]);
    const [showQRCode, setShowQRCode] = useState(false);

    // Sloučení ingrediencí (sečtení stejných položek)
    const mergeIngredients = (ingredients) => {
        const map = new Map();
        ingredients.forEach(({ name, quantity, unit }) => {
            if (quantity == null) return;
            const key = `${name}-${unit}`;
            if (map.has(key)) {
                map.get(key).quantity += Number(quantity);
            } else {
                map.set(key, { name, quantity: Number(quantity), unit });
            }
        });
        return Array.from(map.values());
    };

    // Načtení ingrediencí z localStorage
    const getIngredientsFromLocalStorage = () => {
        const stored = localStorage.getItem("cart");
        return stored ? JSON.parse(stored) : [];
    };

    // Při každém načtení komponenty načteme košík
    const storedIngredients = getIngredientsFromLocalStorage();
    const merged = mergeIngredients(storedIngredients);

    // Vyprázdnění košíku
    const handleClearCart = () => {
        localStorage.removeItem("cart");
        setMergedIngredients([]);
    };

    // Vytisknutí seznamu
    const handlePrint = () => {
        window.print();
    };

    // Vytvoření textu pro QR kód (bez diakritiky)
    const generateShoppingListText = () => {
        return merged
            .map(item =>
                `${removeDiacritics(item.name)} ${item.quantity} ${removeDiacritics(getDeclinedUnit(item.unit, item.quantity))}`
            )
            .join("\n");
    };

    // Zobrazení QR kódu
    const handleGenerateQR = () => {
        setShowQRCode(true);
    };

    return (
        <div className="shopping-list-container">
            <h1>Nákupní seznam</h1>

            {merged.length === 0 ? (
                <p>Seznam je prázdný.</p>
            ) : (
                <ul>
                    {merged.map((item, index) => (
                        <li key={index}>
                            <span className="ingredient-name">{item.name}</span>
                            <span className="ingredient-quantity">{item.quantity}</span>
                            <span className="ingredient-unit">{getDeclinedUnit(item.unit, item.quantity)}</span>
                        </li>
                    ))}
                </ul>
            )}

            {merged.length > 0 && (
                <div className="buttons-container">
                    <button onClick={handlePrint}>Tisknout</button>
                    <button onClick={handleClearCart}>Vysypat košík</button>
                    <button onClick={handleGenerateQR}>Vygeneruj QR kód</button>
                </div>
            )}

            {showQRCode && (
                <div className="qr-code-container">
                    <div>
                        <QRCode value={generateShoppingListText()} size={256} />
                    </div>
                    <p style={{ textAlign: "center", marginTop: "8px" }}>Naskenuj mě!</p>
                </div>
            )}

        </div>
    );
};

export default ShoppingList;
