const unitDeclensions = {
    "lžíce": ["lžíce", "lžíce", "lžic"],
    "lžička": ["lžička", "lžičky", "lžiček"],
    "hrst": ["hrst", "hrsti", "hrstí"],
    "plátek": ["plátek", "plátky", "plátků"],
    "stroužek": ["stroužek", "stroužky", "stroužků"],
    "konzerva": ["konzerva", "konzervy", "konzerv"],
    "lístek": ["lístek", "lístky", "lístků"],
    "kulička": ["kulička", "kuličky", "kuliček"],
    "hrnek": ["hrnek", "hrnky", "hrnků"],
};

export const getDeclinedUnit = (unit, quantity) => {
    const forms = unitDeclensions[unit];
    if (!forms) return unit;

    if (quantity === 1) return forms[0];         // 1 kus
    if (quantity < 5) return forms[1];           // 2–4 kusy
    return forms[2];                             // 5 a více kusů
};
