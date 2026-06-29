const UNIT_ALIASES = {
    'lingura': 'linguri',
    'linguri': 'linguri',
    'lingurita': 'lingurita',
    'lingurite': 'lingurita',
    'buc': 'buc',
    'bucata': 'buc',
    'bucati': 'buc',
    'catel': 'catei',
    'catei': 'catei',
    'capatana': 'capatana',
    'capatani': 'capatana',
};

const NAME_ALIASES = {
    'rosie': 'rosie',
    'rosii': 'rosie',
    'ou': 'ou',
    'oua': 'ou',
    'morcov': 'morcov',
    'morcovi': 'morcov',
    'cartof': 'cartof',
    'cartofi': 'cartof',
};

function stripDiacritics(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function normalizeText(str) {
    return stripDiacritics(String(str).trim().toLowerCase());
}

function canonicalUnit(unit) {
    const base = normalizeText(unit);
    return UNIT_ALIASES[base] || base;
}

function canonicalName(name) {
    const base = normalizeText(name);
    return NAME_ALIASES[base] || base;
}

export function aggregateIngredients(selectedRecipes) {
    const map = new Map();

    selectedRecipes.forEach(({ recipe, servings }) => {
        const baseServings = recipe.servings || 1;
        const scale = servings / baseServings;

        recipe.ingredients.forEach((ing) => {
            const key = `${canonicalName(ing.name)}|${canonicalUnit(ing.unit)}`;
            const scaledAmount = ing.amount * scale;

            if (map.has(key)) {
                const existing = map.get(key);
                existing.amount += scaledAmount;
                if (!existing.recipes.includes(recipe.name)) {
                    existing.recipes.push(recipe.name);
                }
            } else {
                map.set(key, {
                    name: ing.name,
                    amount: scaledAmount,
                    unit: ing.unit,
                    recipes: [recipe.name],
                });
            }
        });
    });

    return Array.from(map.values())
        .map((item) => ({
            ...item,
            amount: Math.round(item.amount * 100) / 100,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
}


export function formatAmount(amount, unit) {
    const rounded = Number.isInteger(amount) ? amount : Math.round(amount * 100) / 100;
    return `${rounded} ${unit}`;
}

export function aggregateNutrition(selectedRecipes) {
    const total = { calories: 0, protein: 0, carbs: 0, fat: 0 };

    selectedRecipes.forEach(({ recipe, servings }) => {
        if (!recipe.nutrition) return;
        total.calories += (recipe.nutrition.calories || 0) * servings;
        total.protein += (recipe.nutrition.protein || 0) * servings;
        total.carbs += (recipe.nutrition.carbs || 0) * servings;
        total.fat += (recipe.nutrition.fat || 0) * servings;
    });

    return {
        calories: Math.round(total.calories),
        protein: Math.round(total.protein),
        carbs: Math.round(total.carbs),
        fat: Math.round(total.fat),
    };
}
