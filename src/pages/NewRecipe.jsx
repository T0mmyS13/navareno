import React, { useState } from "react";
import { TextField, Button, Box, Typography, Grid, IconButton, Divider } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

const AddRecipePage = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [ingredients, setIngredients] = useState([{ name: "", quantity: "", unit: "" }]);
    const [instructions, setInstructions] = useState([""]);
    const [time, setTime] = useState("");
    const [difficulty, setDifficulty] = useState(1);
    const [image, setImage] = useState("");

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
        console.log("Nový recept:", newRecipe);
    };

    return (
        <Box sx={{ padding: 3, maxWidth: "85%", margin: "auto" }}>
            <Typography variant="h4" gutterBottom>
                Přidat nový recept
            </Typography>

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    {/* Název, popis, obrázek, odkaz */}
                    <Grid item xs={12}>
                        <TextField
                            label="Název receptu"
                            variant="outlined"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Popis"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Obrázek (URL)"
                            variant="outlined"
                            fullWidth
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                        />
                    </Grid>

                    {/* Čas přípravy a složitost */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Čas přípravy (v minutách)"
                            variant="outlined"
                            fullWidth
                            type="number"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Složitost (1-5)"
                            variant="outlined"
                            fullWidth
                            type="number"
                            inputProps={{ min: 1, max: 5 }}
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            required
                            sx={{ minWidth: 120}}
                        />
                    </Grid>

                    <Divider sx={{ marginY: 3, width: "100%" }} />

                    {/* Ingredience */}
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Ingredience:
                        </Typography>
                        {ingredients.map((ingredient, index) => (
                            <Box key={index} sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
                                <TextField
                                    label="Název ingredience"
                                    variant="outlined"
                                    value={ingredient.name}
                                    onChange={(e) =>
                                        setIngredients(
                                            ingredients.map((ing, i) =>
                                                i === index ? { ...ing, name: e.target.value } : ing
                                            )
                                        )
                                    }
                                    sx={{ marginRight: 1 }}
                                />
                                <TextField
                                    label="Množství"
                                    variant="outlined"
                                    type="number"
                                    value={ingredient.quantity}
                                    onChange={(e) =>
                                        setIngredients(
                                            ingredients.map((ing, i) =>
                                                i === index ? { ...ing, quantity: e.target.value } : ing
                                            )
                                        )
                                    }
                                    sx={{ marginRight: 1 }}
                                />
                                <TextField
                                    label="Jednotka"
                                    variant="outlined"
                                    value={ingredient.unit}
                                    onChange={(e) =>
                                        setIngredients(
                                            ingredients.map((ing, i) =>
                                                i === index ? { ...ing, unit: e.target.value } : ing
                                            )
                                        )
                                    }
                                    sx={{ marginRight: 1 }}
                                />
                                <IconButton onClick={() => handleRemoveIngredient(index)} color="error">
                                    <Remove />
                                </IconButton>
                            </Box>
                        ))}
                        <Button variant="contained" onClick={handleAddIngredient} startIcon={<Add />}>
                            Přidat ingredienci
                        </Button>
                    </Grid>

                    <Divider sx={{ marginY: 3, width: "100%" }} />

                    {/* Postup */}
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Postup:
                        </Typography>
                        {instructions.map((instruction, index) => (
                            <Box key={index} sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
                                <TextField
                                    label={`Krok ${index + 1}`}
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    value={instruction}
                                    onChange={(e) =>
                                        setInstructions(
                                            instructions.map((instr, i) =>
                                                i === index ? e.target.value : instr
                                            )
                                        )
                                    }
                                    sx={{ marginRight: 1 }}
                                />
                                <IconButton onClick={() => handleRemoveInstruction(index)} color="error">
                                    <Remove />
                                </IconButton>
                            </Box>
                        ))}
                        <Button variant="contained" onClick={handleAddInstruction} startIcon={<Add />}>
                            Přidat krok
                        </Button>
                    </Grid>
                </Grid>

                {/* Tlačítko pro přidání receptu */}
                <Box sx={{ textAlign: "center", marginTop: 4 }}>
                    <Button variant="contained" color="primary" type="submit">
                        Přidat recept
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default AddRecipePage;
