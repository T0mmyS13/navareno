import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/RecipeDetail.css";
import FoodItem from "../atoms/FoodItem.jsx";
import {convertUnits, getDeclinedUnit} from "../utils/units.js";
import { DataGrid } from "@mui/x-data-grid";
import { useToast } from "../utils/ToastNotify.jsx";
import Checkbox from '@mui/material/Checkbox'; // Importujeme MUI Checkbox

const RecipeDetail = () => {
    const { category, recipeName } = useParams();
    const [portionCount, setPortionCount] = useState(2);
    const [recipe, setRecipe] = useState(null);
    const [adjustedIngredients, setAdjustedIngredients] = useState([]);
    const storageKey = `checkedRows_${category}_${recipeName}`;
    const [checkedRows, setCheckedRows] = useState(() => {
        const saved = localStorage.getItem(storageKey);
        return saved ? JSON.parse(saved) : [];
    });
    const { showToast } = useToast();


    const fetchRecipe = () => {
        const storedRecipes = JSON.parse(localStorage.getItem(category)) || [];
        const foundRecipe = storedRecipes.find(
            (r) => r.title.toLowerCase() === recipeName.toLowerCase()
        );
        if (foundRecipe) {
            setRecipe(foundRecipe);
            setAdjustedIngredients(foundRecipe.ingredients);
        } else {
            console.error("Recept nebyl nalezen.");
        }
    };

    if (!recipe) {
        fetchRecipe();
        return <p>Načítám recept...</p>;
    }

    const adjustIngredientsForPortions = (ingredients, currentPortions, targetPortions) => {
        return ingredients.map(ingredient => {
            if (ingredient.quantity !== null && ingredient.quantity !== undefined) {
                return {
                    ...ingredient,
                    quantity: ingredient.quantity * (targetPortions / currentPortions),
                    unit: normalizeUnit(ingredient.unit),
                };
            }
            return ingredient;
        });
    };

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
                return unit;
        }
    };

    const handlePortionChange = (e) => {
        const newPortionCount = e.target.value;
        setPortionCount(newPortionCount);

        if (recipe && recipe.ingredients) {
            const adjusted = adjustIngredientsForPortions(
                recipe.ingredients,
                2,
                newPortionCount
            ).map(ingredient => {
                const { quantity, unit } = convertUnits(ingredient.quantity, ingredient.unit);
                return { ...ingredient, quantity, unit };
            });
            setAdjustedIngredients(adjusted);
        }
    };

    const saveToCart = () => {
        const storedIngredients = JSON.parse(localStorage.getItem("cart")) || [];
        const ingredientsToAdd = adjustedIngredients.filter((ingredient, index) => !checkedRows.includes(index));
        const updatedIngredients = [...storedIngredients, ...ingredientsToAdd];
        localStorage.setItem("cart", JSON.stringify(updatedIngredients));

        showToast("Ingredience byly přidány do nákupního seznamu.", "success");
    };

    const handleCheckboxChange = (index) => {
        const newCheckedRows = checkedRows.includes(index)
            ? checkedRows.filter(id => id !== index)
            : [...checkedRows, index];

        setCheckedRows(newCheckedRows);
        localStorage.setItem(storageKey, JSON.stringify(newCheckedRows));
    };


    return (
        <div className="recipe-detail">
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

                <div className="portion-input">
                    <label htmlFor="portion-count" className="portion-label">Počet porcí:</label>
                    <input
                        id="portion-count"
                        type="number"
                        className="portion-input-field"
                        value={portionCount}
                        onChange={handlePortionChange}
                        min="1"
                    />
                </div>

                {adjustedIngredients && adjustedIngredients.length > 0 ? (
                    <div className="ingredients-container">
                        <DataGrid
                            rows={adjustedIngredients.map((ingredient, index) => ({
                                id: index,
                                name: ingredient.name,
                                quantity: ingredient.quantity,
                                unit: getDeclinedUnit(ingredient.unit, ingredient.quantity),
                                isChecked: checkedRows.includes(index), // Stav zaškrtnutí
                            }))}
                            columns={[
                                {
                                    field: 'checkbox',
                                    headerName: 'Mám',
                                    renderCell: (params) => (
                                        <Checkbox
                                            checked={params.row.isChecked}
                                            onChange={() => handleCheckboxChange(params.row.id)}
                                            color="primary"
                                        />
                                    ),
                                    width: 85,
                                },
                                { field: 'name', headerName: 'Ingredience', flex: 1 },
                                { field: 'quantity', headerName: 'Množství', flex: 1, type: 'number' },
                                { field: 'unit', headerName: 'Jednotka', flex: 1 },
                            ]}
                            pageSize={5}
                            rowHeight={40}
                            getRowClassName={(params) => params.row.isChecked ? 'checked-row' : ''} // Podmíněná třída pro zaškrtnuté řádky
                            hideFooter
                        />
                    </div>
                ) : (
                    <p>Ingredience nejsou k dispozici.</p>
                )}

                <button className="cart-button" onClick={saveToCart}>
                    Uložit do nákupního seznamu
                </button>

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

                <a href={`/${category}`} className="back-button">
                    Zpět
                </a>
            </div>
        </div>
    );
};

export default RecipeDetail;
