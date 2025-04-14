import React from "react";
import "../styles/Category.css";

const difficulties = ["Snadné", "Střední", "Obtížné"];

const Food = ({ title, description, image, category, time, difficulty, rating }) => {
        const difficultyText = difficulties[difficulty - 1] || "Neznámá";

        return (
            <a href={`/${category}/${title.toLowerCase()}`} className="category">
                    <img src={image} alt={title} className="category-image" />
                    <h3 className="category-title">{title}</h3>
                    <p className="category-description">{description}</p>
                    <p><strong>⏱ Čas:</strong> {time} min</p>
                    <p><strong>🔧 Obtížnost:</strong> {difficultyText}</p>
                    <p><strong>⭐ Hodnocení:</strong> {rating}/5</p>
            </a>
        );
};

export default Food;
