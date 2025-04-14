import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/RecipeDetail.css";
import FoodItem from "../atoms/FoodItem.jsx"; // Importujeme FoodItem komponentu

const RecipeDetail = () => {
    const { category, recipeName } = useParams(); // Kategorie + název receptu z URL
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        console.log("Načítám JSON:", `/recipes/${category}.json`);
        fetch(`/recipes/${category}.json`) // Dynamické načítání podle kategorie
            .then((response) => response.json())
            .then((data) => {
                const foundRecipe = data.find(
                    (r) => r.title.toLowerCase() === recipeName.toLowerCase()
                );
                setRecipe(foundRecipe);
            })
            .catch((error) => console.error("Chyba při načítání receptu:", error));
    }, [category, recipeName]);

    // Pokud recept není nalezen, zobrazí se zpráva
    if (!recipe) {
        return <p>Recept nebyl nalezen.</p>;
    }

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
                {/* Zkontroluj, zda ingredients existují a nejsou prázdné */}
                {recipe.ingredients && recipe.ingredients.length > 0 ? (
                    <ul>
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
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
