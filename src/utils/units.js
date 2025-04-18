export const getDeclinedUnit = (unit, quantity) => {
    if (quantity === 1) {
        return unit; // Jednotné číslo
    }
    if (unit === "lžíce") {
        return quantity < 5 ? "lžíce" : "lžic";
    }
    if (unit === "lžička") {
        return quantity < 5 ? "lžičky" : "lžiček";
    }
    if (unit === "hrst") {
        return quantity < 5 ? "hrsti" : "hrstí";
    }
    if (unit === "plátek") {
        return quantity < 5 ? "plátky" : "plátků";
    }
    if (unit === "stroužek") {
        return quantity < 5 ? "stroužky" : "stroužků";
    }
    if (unit === "konzerva") {
        return quantity < 5 ? "konzervy" : "konzerv";
    }
    if (unit === "lístek") {
        return quantity < 5 ? "lístky" : "lístků";
    }
    if (unit === "kulička") {
        return quantity < 5 ? "kuličky" : "kuliček";
    }
    return unit; // Pokud není žádná specifická skloňovací logika, vrátíme původní jednotku
};
