import React, { useState } from "react";
import {
    TextField,
    Button,
    Box,
    Typography,
    IconButton,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Autocomplete
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useToast } from "../utils/ToastNotify.jsx";
import ImageIcon from "@mui/icons-material/Image";
import "../styles/NewRecipe.css";

const AddRecipePage = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [ingredients, setIngredients] = useState([{ name: "", quantity: "", unit: "" }]);
    const [instructions, setInstructions] = useState([""]);
    const [time, setTime] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState("");
    const { showToast } = useToast();

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
    };

    const handleRemoveIngredient = (index) => {
        const newIngredients = [...ingredients];
        newIngredients.splice(index, 1);
        setIngredients(newIngredients);
    };

    const handleAddInstruction = () => {
        setInstructions([...instructions, ""]);
    };

    const handleRemoveInstruction = (index) => {
        const newInstructions = [...instructions];
        newInstructions.splice(index, 1);
        setInstructions(newInstructions);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title.trim() || title.trim().length < 5) {
            showToast("Název receptu musí mít alespoň 5 znaků", "error");
            return;
        }
        if (!description.trim() || description.trim().length < 10) {
            showToast("Popis musí mít alespoň 10 znaků", "error");
            return;
        }

        if (ingredients.length === 0 || ingredients.every(ing => !ing.name.trim())) {
            showToast("Musí být zadána alespoň jedna ingredience s názvem", "error");
            return;
        }
        if (ingredients.some(ing => isNaN(ing.quantity) || ing.quantity <= 0 || !ing.unit)) {
            showToast("Množství u všech ingrediencí musí být platné číslo větší než 0 a musí být vyplněna jednotka", "error");
            return;
        }

        if (instructions.length === 0 || instructions.every(instr => !instr.trim())) {
            showToast("Musí být zadán alespoň jeden krok postupu", "error");
            return;
        }


        const normalizedCategory = category
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
            .replace(/\s+/g, "-");

        const storedRecipes = JSON.parse(localStorage.getItem(normalizedCategory)) || [];
        const isDuplicate = storedRecipes.some(recipe => recipe.title.toLowerCase() === title.toLowerCase());
        if (isDuplicate) {
            showToast(`Recept pod názvem ${title} už existuje`, "error");
            return;
        }

        const newRecipe = {
            title,
            description,
            ingredients,
            instructions,
            time,
            difficulty,
            image,
            rating: null,
        };

        const updatedRecipes = [...storedRecipes, newRecipe];
        localStorage.setItem(normalizedCategory, JSON.stringify(updatedRecipes));
        showToast("Recept přidán", "success");

        // Resetuj formulář
        setTitle("");
        setDescription("");
        setIngredients([{ name: "", quantity: "", unit: "" }]);
        setInstructions([""]);
        setTime("");
        setDifficulty("");
        setCategory("");
        setImage("");
    };

    return (
        <div className="add-recipe-container">
            <form onSubmit={handleSubmit}>
                <div className="top-section">
                    <div className="category-title-row">
                        <div className="title-field">
                            <TextField
                                label="Název receptu"
                                variant="outlined"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                fullWidth
                            />
                        </div>
                        <div className="category-field">
                            <FormControl fullWidth required>
                                <InputLabel id="category-label">Kategorie</InputLabel>
                                <Select
                                    labelId="category-label"
                                value={category}
                                    label="Kategorie"
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {["předkrmy", "polévky", "saláty", "hlavní chody", "dezerty", "nápoje"].map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option.charAt(0).toUpperCase() + option.slice(1)}
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        </div>
                    </div>

                    <div className="image-preview">
                        {image && <img src={image} alt="náhled" />}
                    </div>

                    <div className="image-upload-section">
                        <Box display="flex" alignItems="center" gap={2}>
                            <TextField
                                label="Odkaz na obrázek"
                                variant="outlined"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                fullWidth
                            />
                            <input
                                accept="image/*"
                                id="upload-image"
                                type="file"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                            setImage(event.target.result); // base64 string
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                            <label htmlFor="upload-image">
                                <IconButton component="span" color="primary">
                                    <ImageIcon />
                                </IconButton>
                            </label>
                        </Box>
                    </div>
                </div>

                <TextField
                    label="Krátký popis (max 30 slov)"
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    multiline
                    rows={2}
                    className="description"
                    inputProps={{ maxLength: 200 }}
                    required
                />

                <div className="info-section">
                    <div className="time-field">
                        <TextField
                            label="Čas přípravy (v minutách)"
                            variant="outlined"
                            type="number"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                            fullWidth
                            inputProps={{ min: 1 }}
                        />
                    </div>
                    <div className="difficulty-field">
                        <FormControl fullWidth required>
                            <InputLabel id="difficulty-label">Složitost</InputLabel>
                            <Select
                                labelId="difficulty-label"
                                value={difficulty}
                                label="Složitost"
                                onChange={(e) => setDifficulty(Number(e.target.value))}
                            >
                                <MenuItem value={1}>Snadné - pro každého</MenuItem>
                                <MenuItem value={2}>Střední - mírná výzva</MenuItem>
                                <MenuItem value={3}>Obtížné - pro zkušené</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>

                <div className="ingredients-section">
                    <Typography variant="h6">Ingredience:</Typography>
                    {ingredients.map((ingredient, index) => (
                        <div className="ingredient-row" key={index}>
                            <TextField
                                label="Ingredience"
                                variant="outlined"
                                value={ingredient.name}
                                onChange={(e) =>
                                    setIngredients(
                                        ingredients.map((ing, i) =>
                                            i === index ? { ...ing, name: e.target.value } : ing
                                        )
                                    )
                                }
                            />
                            <TextField
                                label="Množství"
                                variant="outlined"
                                type="number"
                                value={ingredient.quantity}
                                inputProps={{ min: 0 }}
                                onChange={(e) =>
                                    setIngredients(
                                        ingredients.map((ing, i) =>
                                            i === index ? { ...ing, quantity: e.target.value } : ing
                                        )
                                    )
                                }
                            />
                            <Autocomplete
                                options={["g", "kg", "ml", "l", "ks", "lžička", "lžíce", "hrst", "plátek", "stroužek", "konzerva", "lístek", "kulička", "hrnek"]}
                                value={ingredient.unit}
                                onChange={(e, newValue) =>
                                    setIngredients(
                                        ingredients.map((ing, i) =>
                                            i === index ? { ...ing, unit: newValue } : ing
                                        )
                                    )
                                }
                                renderInput={(params) => (
                                    <TextField {...params} label="Jednotka" variant="outlined" />
                                )}
                            />
                            <IconButton onClick={() => handleRemoveIngredient(index)} color="error">
                                <Remove />
                            </IconButton>
                        </div>
                    ))}
                    <Button variant="outlined" onClick={handleAddIngredient} startIcon={<Add />}>
                        Přidat ingredienci
                    </Button>
                </div>

                <div className="instructions-section">
                    <Typography variant="h6">Postup:</Typography>
                    {instructions.map((instruction, index) => (
                        <div className="instruction-row" key={index}>
                            <TextField
                                label={`Krok ${index + 1}`}
                                variant="outlined"
                                multiline
                                rows={3}
                                fullWidth
                                value={instruction}
                                onChange={(e) =>
                                    setInstructions(
                                        instructions.map((instr, i) =>
                                            i === index ? e.target.value : instr
                                        )
                                    )
                                }
                            />
                            <IconButton
                                onClick={() => handleRemoveInstruction(index)}
                                color="error"
                                className="remove-button"
                            >
                                <Remove />
                            </IconButton>
                        </div>
                    ))}

                    <Button variant="outlined" onClick={handleAddInstruction} startIcon={<Add />}>
                        Přidat krok
                    </Button>
                </div>

                <div className="submit-section">
                    <Button variant="contained" type="submit">
                        Přidat recept
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddRecipePage;
