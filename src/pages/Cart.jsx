import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { useCart } from '../context/useCart';
import { aggregateIngredients, aggregateNutrition, formatAmount } from '../utils/aggregateIngredients';

const CHECKED_STORAGE_KEY = 'gourmet-explorer-checked';

export default function Cart() {
    const { selectedRecipes, removeRecipe, updateServings, clearCart } = useCart();

    const [checkedItems, setCheckedItems] = useState(() => {
        try {
            const saved = localStorage.getItem(CHECKED_STORAGE_KEY);
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(CHECKED_STORAGE_KEY, JSON.stringify(checkedItems));
        } catch (err) {
            console.error('Eroare la salvarea stării bifate:', err);
        }
    }, [checkedItems]);

    const shoppingList = aggregateIngredients(selectedRecipes);
    const nutrition = aggregateNutrition(selectedRecipes);

    const toggleChecked = (key) => {
        setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleClearAll = () => {
        clearCart();
        setCheckedItems({});
    };

    const handlePrint = () => window.print();

    const handleCopyToClipboard = () => {
        const text = shoppingList
            .map((item) => `• ${formatAmount(item.amount, item.unit)} ${item.name}`)
            .join('\n');
        navigator.clipboard.writeText(text);
        alert('Lista de cumpărături a fost copiată!');
    };

    if (selectedRecipes.length === 0) {
        return (
            <div className="page-container">
                <div className="empty-cart">
                    <div className="empty-cart-icon">🛒</div>
                    <h2>Lista ta de cumpărături este goală</h2>
                    <p>Răsfoiește rețetele și adaugă-le pentru a-ți genera lista automat.</p>
                    <Link to="/" className="primary-button">
                        Răsfoiește rețete
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <header className="header">
                <h1>🛒 Lista de cumpărături</h1>
                <p>Generată automat din rețetele selectate</p>
            </header>

            <div className="nutrition-summary">
                <h2 className="nutrition-summary-title">🔥 Total nutrițional</h2>
                <div className="nutrition-summary-grid">
                    <div className="nutrition-summary-item">
                        <span className="ns-value">{nutrition.calories}</span>
                        <span className="ns-label">kcal</span>
                    </div>
                    <div className="nutrition-summary-item">
                        <span className="ns-value">{nutrition.protein}g</span>
                        <span className="ns-label">Proteine</span>
                    </div>
                    <div className="nutrition-summary-item">
                        <span className="ns-value">{nutrition.carbs}g</span>
                        <span className="ns-label">Carbohidrați</span>
                    </div>
                    <div className="nutrition-summary-item">
                        <span className="ns-value">{nutrition.fat}g</span>
                        <span className="ns-label">Grăsimi</span>
                    </div>
                </div>
            </div>

            <div className="cart-layout">
                <section className="selected-recipes-panel">
                    <div className="panel-header">
                        <h2>Rețete selectate ({selectedRecipes.length})</h2>
                        <button className="clear-btn" onClick={handleClearAll}>
                            Șterge tot
                        </button>
                    </div>

                    <div className="selected-recipes-list">
                        {selectedRecipes.map(({ recipe, servings }) => (
                            <div key={recipe.id} className="selected-recipe">
                                <Link to={`/recipe/${recipe.id}`}>
                                    <img
                                        src={recipe.image}
                                        alt={recipe.name}
                                        className="selected-recipe-image"
                                    />
                                </Link>
                                <div className="selected-recipe-info">
                                    <Link to={`/recipe/${recipe.id}`} className="selected-recipe-name">
                                        {recipe.name}
                                    </Link>
                                    <p className="selected-recipe-meta">
                                        ⏱ {recipe.time} min · {recipe.difficulty}
                                    </p>
                                    <div className="servings-control">
                                        <label>Porții:</label>
                                        <button
                                            className="servings-btn"
                                            onClick={() => updateServings(recipe.id, servings - 1)}
                                            disabled={servings <= 1}
                                        >
                                            −
                                        </button>
                                        <span className="servings-value">{servings}</span>
                                        <button
                                            className="servings-btn"
                                            onClick={() => updateServings(recipe.id, servings + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <button
                                    className="remove-btn"
                                    onClick={() => removeRecipe(recipe.id)}
                                    aria-label="Elimină de pe listă"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="shopping-list-panel">
                    <div className="panel-header">
                        <h2>Ingrediente de cumpărat ({shoppingList.length})</h2>
                        <div className="action-buttons">
                            <button className="action-btn" onClick={handleCopyToClipboard}>
                                📋 Copiază
                            </button>
                            <button className="action-btn" onClick={handlePrint}>
                                🖨 Printează
                            </button>
                        </div>
                    </div>

                    <ul className="shopping-list">
                        {shoppingList.map((item) => {
                            const key = `${item.name}|${item.unit}`;
                            const checked = !!checkedItems[key];
                            return (
                                <li
                                    key={key}
                                    className={checked ? 'shopping-item shopping-item-checked' : 'shopping-item'}
                                    onClick={() => toggleChecked(key)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => toggleChecked(key)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="shopping-checkbox"
                                    />
                                    <div className="shopping-item-content">
                                        <span className="shopping-amount">
                                            {formatAmount(item.amount, item.unit)}
                                        </span>
                                        <span className="shopping-name">{item.name}</span>
                                        {item.recipes.length > 1 && (
                                            <span className="shopping-recipes-tag">
                                                {item.recipes.length} rețete
                                            </span>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            </div>
        </div>
    );
}