
const loadCategoriesToLocalStorage = async () => {
    const categories = ["predkrmy", "polevky", "salaty", "hlavni-chody", "dezerty", "napoje"]; // Add your categories here

    for (const category of categories) {
        // Check if the category already exists in localStorage
        if (localStorage.getItem(category)) {
            console.log(`${category} already exists in localStorage. Skipping...`);
            continue;
        }

        try {
            const response = await fetch(`/recipes/${category}.json`);
            if (!response.ok) {
                console.error(`Failed to fetch ${category}.json:`, response.statusText);
                continue;
            }

            const data = await response.json();
            localStorage.setItem(category, JSON.stringify(data));
            console.log(`Loaded ${category} into localStorage.`);
        } catch (error) {
            console.error(`Error loading ${category}.json:`, error);
        }
    }
};

export default loadCategoriesToLocalStorage;