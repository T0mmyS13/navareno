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
                    <span> <img src="/icons/clock.svg" alt="Clock" style={{ width: "16px", marginRight: "5px" }} /> {time} min</span>
                    <span><img src={`/icons/${difficulty === 1 ? "easy" : difficulty === 2 ? "medium" : "hard"}.png`} alt={difficultyText} style={{ width: "16px", marginRight: "10px" }} />{difficultyText} </span>
                    <span><img src="/icons/star.png" alt="Star" style={{ width: "16px", marginRight: "10px" }} />{rating}/5</span>
            </a>
        );
};

export default Food;
