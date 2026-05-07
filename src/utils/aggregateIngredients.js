export function aggregateIngredients(selectedRecipes) {
    const map = new Map();

    selectedRecipes.forEach(({ recipe, servings }) => {
        const baseServings = recipe.servings || 1;
        const scale = servings / baseServings;

        recipe.ingredients.forEach((ing) => {
            const key = `${ing.name.toLowerCase()}|${ing.unit}`;
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
