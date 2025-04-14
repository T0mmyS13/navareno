import React, { useState } from "react";
import "../styles/FoodItem.css";

const difficulties = ["Snadné", "Střední", "Obtížné"];

const FoodItem = ({ title, description, image, time, difficulty, rating, ratingsCount }) => {
    const difficultyText = difficulties[difficulty - 1] || "Neznámá";

    // Načítání hodnoty hodnocení z localStorage při načítání komponenty
    const savedRating = localStorage.getItem(`rating-${title}`);
    const savedVotes = localStorage.getItem(`votes-${title}`);

    const [averageRating, setAverageRating] = useState(savedRating ? parseFloat(savedRating) : rating || 0);
    const [votes, setVotes] = useState(savedVotes ? parseInt(savedVotes, 10) : ratingsCount || 1);
    const [hasRated, setHasRated] = useState(savedRating !== null); // Pokud je v localStorage hodnocení, uživatel již hodnotil

    const handleRatingChange = (e) => {
        if (hasRated) return; // Pokud už uživatel hodnotil, neumožníme změnu

        const selectedRating = parseInt(e.target.value); // Získání nové hodnoty hodnocení
        const totalRating = averageRating * votes + selectedRating;
        const newVotes = votes + 1;
        const newAverageRating = totalRating / newVotes;

        setAverageRating(newAverageRating); // Nastavení nového průměru
        setVotes(newVotes); // Nastavení nového počtu hodnocení
        setHasRated(true); // Nastavení, že uživatel již hodnotil

        // Uložení nového hodnocení a počtu hlasů do localStorage
        localStorage.setItem(`rating-${title}`, newAverageRating);
        localStorage.setItem(`votes-${title}`, newVotes);
    };

    return (
        <div className="food-item">
            <img src={image} alt={title} className="food-image" />
            <h3 className="food-title">{title}</h3>
            <p className="food-description">{description}</p>
            <div className="food-info">
                <span>⏱ {time} min</span>
                <span>🔧 Obtížnost: {difficultyText}</span>
                <span>⭐ {averageRating.toFixed(1)}/5 ({votes} hodnocení)</span>
            </div>
            <div className="rating-section">
                <label>Ohodnoťte: </label>
                <select onChange={handleRatingChange} defaultValue="0" disabled={hasRated} className="rating-select">
                    <option value="0" disabled>Vyberte...</option>
                    {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num} ⭐</option>
                    ))}
                </select>
                {hasRated && <p className="thank-you-message">Děkujeme za hodnocení!</p>}
            </div>
        </div>
    );
};

export default FoodItem;
