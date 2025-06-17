import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

// Stránka pro přidání, úpravu nebo kopírování receptu
const AddRecipePage = () => {
    // Stavy pro režimy úpravy a kopírování, původní název receptu
    const [isEditing, setIsEditing] = useState(false);
    const [isCopying, setIsCopying] = useState(false);
    const [originalTitle, setOriginalTitle] = useState('');

    // Načtení dat pro úpravu nebo kopírování receptu ze sessionStorage
    const loadEditingData = () => {
        const editingRecipeData = sessionStorage.getItem('editingRecipe');
        if (editingRecipeData) {
            const editingRecipe = JSON.parse(editingRecipeData);
            sessionStorage.removeItem('editingRecipe'); // Vymazání sessionStorage
            setIsEditing(true);
            setOriginalTitle(editingRecipe.title);

            return editingRecipe;
        }
        const copyingRecipeData = sessionStorage.getItem('copyingRecipe');
        if (copyingRecipeData) {
            const copyingRecipe = JSON.parse(copyingRecipeData);
            sessionStorage.removeItem('copyingRecipe'); // Vymazání sessionStorage
            setIsEditing(false);
            setIsCopying(true);
            // Pro kopírování vymažeme název, aby uživatel zadal nový
            return { ...copyingRecipe, title: '' };
        }

        return null;
    };

    // Inicializace dat receptu (pro úpravu/kopírování nebo nový recept)
    const editingRecipe = loadEditingData();

    // Stavy pro jednotlivá pole formuláře
    const [title, setTitle] = useState(editingRecipe ? editingRecipe.title : "");
    const [description, setDescription] = useState(editingRecipe ? editingRecipe.description : "");
    const [image, setImage] = useState(editingRecipe ? editingRecipe.image : "");
    const [portion, setPortion] = useState(editingRecipe ? editingRecipe.portion : "");
    const [time, setTime] = useState(editingRecipe ? editingRecipe.time : "");
    const [instructions, setInstructions] = useState(editingRecipe ? editingRecipe.instructions : [""]);
    const [ingredients, setIngredients] = useState(editingRecipe ? editingRecipe.ingredients : [{ name: "", quantity: "", unit: "" }]);
    const [selectedCategory, setSelectedCategory] = useState(
        editingRecipe && editingRecipe.category ? editingRecipe.category : ""
    );
    const [difficulty, setDifficulty] = useState(editingRecipe ? editingRecipe.difficulty : "");
    const { showToast } = useToast();
    const navigate = useNavigate();

    // Přidání nové ingredience do pole
    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
    };

    // Odebrání ingredience podle indexu
    const handleRemoveIngredient = (index) => {
        const newIngredients = [...ingredients];
        newIngredients.splice(index, 1);
        setIngredients(newIngredients);
    };

    // Přidání nového kroku postupu
    const handleAddInstruction = () => {
        setInstructions([...instructions, ""]);
    };

    // Odebrání kroku postupu podle indexu
    const handleRemoveInstruction = (index) => {
        const newInstructions = [...instructions];
        newInstructions.splice(index, 1);
        setInstructions(newInstructions);
    };

    // Odeslání formuláře
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validace názvu receptu
        if (!title.trim() || title.trim().length < 5) {
            showToast("Název receptu musí mít alespoň 5 znaků", "error");
            return;
        }
        // Validace popisu
        if (!description.trim() || description.trim().length < 10) {
            showToast("Popis musí mít alespoň 10 znaků", "error");
            return;
        }
        // Validace ingrediencí
        if (ingredients.length === 0 || ingredients.every(ing => !ing.name.trim())) {
            showToast("Musí být zadána alespoň jedna ingredience s názvem", "error");
            return;
        }
        if (ingredients.some(ing => isNaN(ing.quantity) || ing.quantity <= 0 || !ing.unit)) {
            showToast("Množství u všech ingrediencí musí být platné číslo větší než 0 a musí být vyplněna jednotka", "error");
            return;
        }
        // Validace postupu
        if (instructions.length === 0 || instructions.every(instr => !instr.trim())) {
            showToast("Musí být zadán alespoň jeden krok postupu", "error");
            return;
        }
        // Validace počtu porcí
        if (!portion || isNaN(portion) || portion < 1) {
            showToast("Počet porcí musí být číslo větší než 0", "error");
            return;
        }

        // Normalizace kategorie pro použití jako klíč v localStorage
        const normalizedCategory = selectedCategory
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Odstranění diakritiky
            .replace(/\s+/g, "-");

        // Načtení existujících receptů z localStorage
        const storedRecipes = JSON.parse(localStorage.getItem(normalizedCategory)) || [];
        let updatedRecipes = storedRecipes;
        if (isEditing) {
            // Při úpravě odstraníme původní recept podle názvu
            updatedRecipes = storedRecipes.filter(recipe => recipe.title !== originalTitle);
        }

        // Kontrola duplicity názvu
        const isDuplicate = updatedRecipes.some(recipe => recipe.title === title);
        if (isDuplicate) {
            showToast(`Recept pod názvem ${title} už existuje`, "error");
            return;
        }

        // Vytvoření objektu nového receptu
        const newRecipe = {
            title,
            description,
            ingredients,
            instructions,
            time,
            difficulty,
            image,
            portion,
            rating: null,
        };

        // Uložení receptu do localStorage
        updatedRecipes.push(newRecipe);
        localStorage.setItem(normalizedCategory, JSON.stringify(updatedRecipes));
        showToast(isEditing ? "Úprava úspěšná" : isCopying ? "Recept zkopírován" : "Recept přidán", "success");

        // Přesměrování na detail receptu
        navigate(`/${normalizedCategory}/${encodeURIComponent(title)}`);
        window.scrollTo(0, 0)
    };

    return (
        <div className="add-recipe-container">
            <form onSubmit={handleSubmit}>
                <div className="top-section">
                    <div className="category-title-row">
                        <div className="title-field">
                            {/* Pole pro název receptu */}
                            <TextField
                                label="Název receptu"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                fullWidth
                                required
                                disabled={isEditing} // Při úpravě nelze měnit název
                                error={(isEditing || isCopying) && !title}
                                helperText={
                                    isEditing
                                        ? "Název receptu nelze při úpravě změnit"
                                        : isCopying
                                            ? "Zadejte nový název pro kopírovaný recept (min. 5 znaků)"
                                            : "Zadejte název receptu (min. 5 znaků)"
                                }
                            />
                        </div>
                        <div className="category-field">
                            {/* Výběr kategorie receptu */}
                            <FormControl fullWidth required>
                                <InputLabel id="category-label">Kategorie</InputLabel>
                                <Select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    fullWidth
                                    disabled={isCopying || isEditing} // Při kopírování/úpravě nelze měnit kategorii
                                >
                                    <MenuItem value="predkrmy">Předkrmy</MenuItem>
                                    <MenuItem value="polevky">Polévky</MenuItem>
                                    <MenuItem value="salaty">Saláty</MenuItem>
                                    <MenuItem value="hlavni-chody">Hlavní chody</MenuItem>
                                    <MenuItem value="dezerty">Dezerty</MenuItem>
                                    <MenuItem value="napoje">Nápoje</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>

                    <div className="image-preview">
                        {/* Náhled obrázku */}
                        {image && <img src={image} alt="náhled" />}
                    </div>

                    <div className="image-upload-section">
                        {/* Nahrání obrázku nebo zadání odkazu */}
                        <Box display="flex" alignItems="center" gap={2}>
                            <TextField
                                label="Odkaz na obrázek"
                                variant="outlined"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                fullWidth
                                disabled={isCopying}
                            />
                            <input
                                accept="image/*"
                                id="upload-image"
                                type="file"
                                disabled={isCopying}
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

                {/* Pole pro popis receptu */}
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
                    disabled={isCopying}
                />

                <div className="info-section">
                    {/* Čas přípravy */}
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
                            disabled={isCopying}
                        />
                    </div>
                    {/* Počet porcí */}
                    <div className="portions-field">
                        <TextField
                            fullWidth
                            label="Počet porcí"
                            type="number"
                            InputProps={{inputProps: {min: 1}}}
                            value={portion}
                            onChange={(e) => setPortion(e.target.value)}
                            required
                            disabled={isCopying}
                        />
                    </div>
                    {/* Složitost receptu */}
                    <div className="difficulty-field">
                        <FormControl fullWidth required>
                            <InputLabel id="difficulty-label">Složitost</InputLabel>
                            <Select
                                labelId="difficulty-label"
                                value={difficulty}
                                label="Složitost"
                                disabled={isCopying}
                                onChange={(e) => setDifficulty(Number(e.target.value))}
                            >
                                <MenuItem value={1}>Snadné - pro každého</MenuItem>
                                <MenuItem value={2}>Střední - mírná výzva</MenuItem>
                                <MenuItem value={3}>Obtížné - pro zkušené</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>

                {/* Sekce ingrediencí */}
                <div className="ingredients-section">
                    <Typography variant="h6">Ingredience:</Typography>
                    {ingredients.map((ingredient, index) => (
                        <div className="ingredient-row" key={index}>
                            {/* Název ingredience */}
                            <TextField
                                label="Ingredience"
                                variant="outlined"
                                disabled={isCopying}
                                value={ingredient.name}
                                onChange={(e) =>
                                    setIngredients(
                                        ingredients.map((ing, i) =>
                                            i === index ? { ...ing, name: e.target.value } : ing
                                        )
                                    )
                                }
                            />
                            {/* Množství ingredience */}
                            <TextField
                                label="Množství"
                                variant="outlined"
                                type="number"
                                disabled={isCopying}
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
                            {/* Jednotka ingredience */}
                            <Autocomplete
                                disabled={isCopying}
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
                            {/* Tlačítko pro odebrání ingredience */}
                            <IconButton onClick={() => handleRemoveIngredient(index)} color="error" disabled={ingredients.length <= 1 || isCopying}
                            >
                                <Remove />
                            </IconButton>
                        </div>
                    ))}
                    {/* Tlačítko pro přidání ingredience */}
                    <Button variant="outlined" onClick={handleAddIngredient} startIcon={<Add />} disabled={isCopying}
                    >
                        Přidat ingredienci
                    </Button>
                </div>

                {/* Sekce postupu */}
                <div className="instructions-section">
                    <Typography variant="h6">Postup:</Typography>
                    {instructions.map((instruction, index) => (
                        <div className="instruction-row" key={index}>
                            {/* Text kroku postupu */}
                            <TextField
                                label={`Krok ${index + 1}`}
                                variant="outlined"
                                multiline
                                disabled={isCopying}
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
                            {/* Tlačítko pro odebrání kroku */}
                            <IconButton
                                onClick={() => handleRemoveInstruction(index)}
                                disabled={ingredients.length <= 1 || isCopying}
                                color="error"
                                className="remove-button"
                            >
                                <Remove />
                            </IconButton>
                        </div>
                    ))}

                    {/* Tlačítko pro přidání kroku */}
                    <Button variant="outlined" onClick={handleAddInstruction} startIcon={<Add />} disabled={isCopying}>
                        Přidat krok
                    </Button>
                </div>

                {/* Tlačítko pro odeslání formuláře */}
                <div className="submit-section">
                    <Button variant="contained" type="submit">
                        {isEditing ? "Upravit recept" : isCopying ? "Zkopírovat recept" : "Přidat recept"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddRecipePage;
