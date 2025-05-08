import React, { useState } from "react";
import "../styles/FoodItem.css";
import {Rating} from "@mui/material";

// Seznam úrovní obtížnosti
const difficulties = ["Snadné", "Střední", "Obtížné"];

const FoodItem = ({ title, description, image, time, difficulty, rating, ratingsCount }) => {
    // Získání textu obtížnosti na základě čísla
    const difficultyText = difficulties[difficulty - 1] || "Neznámá";

    // Načítání hodnoty hodnocení a počtu hodnocení z localStorage (pokud existují)
    const savedRating = localStorage.getItem(`rating-${title}`);
    const savedVotes = localStorage.getItem(`votes-${title}`);

    // Nastavení počátečních hodnot pro průměrné hodnocení a počet hlasů
    const [averageRating, setAverageRating] = useState(savedRating ? parseFloat(savedRating) : rating || 0);
    const [votes, setVotes] = useState(savedVotes ? parseInt(savedVotes, 10) : ratingsCount || 1);
    const [hasRated, setHasRated] = useState(savedRating !== null); // Stav, zda uživatel již hodnotil

    // Funkce pro změnu hodnocení
    const handleRatingChange = (e) => {
        // Pokud uživatel již hodnotil, neumožníme změnu hodnocení
        if (hasRated) return;

        const selectedRating = parseInt(e.target.value); // Získání nové hodnoty hodnocení
        const totalRating = averageRating * votes + selectedRating; // Součet všech hodnocení
        const newVotes = votes + 1; // Nový počet hlasování
        const newAverageRating = totalRating / newVotes; // Výpočet nového průměru

        setAverageRating(newAverageRating); // Aktualizace průměrného hodnocení
        setVotes(newVotes); // Aktualizace počtu hodnocení
        setHasRated(true); // Označení, že uživatel již hodnotil

        // Uložení nových hodnot do localStorage
        localStorage.setItem(`rating-${title}`, newAverageRating);
        localStorage.setItem(`votes-${title}`, newVotes);
    };

    return (
        <div className="food-item">
            {/* Obrázek jídla */}
            <img src={image} alt={title} className="food-image" />

            {/* Název jídla */}
            <h3 className="food-title">{title}</h3>

            {/* Popis jídla */}
            <p className="food-description">{description}</p>

            {/* Informace o jídle */}
            <div className="food-info">
                <span> <img src="/icons/clock.svg" alt="Clock" style={{ width: "16px", marginRight: "5px" }} /> {time} min</span>
                <span>{difficultyText} <img src={`/icons/${difficulty === 1 ? "easy" : difficulty === 2 ? "medium" : "hard"}.png`} alt={difficultyText} style={{ width: "24px", marginLeft: "10px" }} /></span>
                <span><img src="/icons/star.png" alt="Star" style={{ width: "16px", marginRight: "10px" }} /> {averageRating.toFixed(1)}/5 ({votes} hodnocení)</span>
            </div>

            {/* Sekce pro hodnocení */}
            <div className="rating-section">
                <label>Ohodnoťte: </label>
                <Rating
                    value={hasRated ? averageRating : null}
                    onChange={(e, newValue) => handleRatingChange({ target: { value: newValue } })}
                    disabled={hasRated} // Pokud uživatel již hodnotil, pole je zakázáno
                />
                {/* Zobrazí zprávu, pokud uživatel již hodnotil */}
                {hasRated && <p className="thank-you-message">Děkujeme za hodnocení!</p>}

            </div>
        </div>
    );
};

export default FoodItem;
