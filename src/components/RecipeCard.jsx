import { Link } from 'react-router';
import { useCart } from '../context/useCart';
import { useFavorites } from '../context/useFavorites';

const DIFFICULTY_COLORS = {
    'Ușor': { bg: '#dcfce7', text: '#166534' },
    'Mediu': { bg: '#fef9c3', text: '#854d0e' },
    'Greu': { bg: '#fee2e2', text: '#991b1b' },
};

export default function RecipeCard({ recipe }) {
    const { isInCart, addRecipe, removeRecipe } = useCart();
    const { isFavorite, toggleFavorite } = useFavorites();
    const inCart = isInCart(recipe.id);
    const fav = isFavorite(recipe.id);
    const colors = DIFFICULTY_COLORS[recipe.difficulty] || { bg: '#f3f4f6', text: '#374151' };

    const handleCartToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (inCart) {
            removeRecipe(recipe.id);
        } else {
            addRecipe(recipe);
        }
    };

    const handleFavoriteToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(recipe);
    };

    return (
        <Link to={`/recipe/${recipe.id}`} className="recipe-card-link">
            <div className="recipe-card">
                <button
                    className={fav ? 'favorite-btn favorite-btn-active' : 'favorite-btn'}
                    onClick={handleFavoriteToggle}
                    aria-label={fav ? 'Elimină din favorite' : 'Adaugă la favorite'}
                >
                    {fav ? '♥' : '♡'}
                </button>

                <img src={recipe.image} alt={recipe.name} className="recipe-image" />

                {recipe.category && (
                    <span className="card-category-badge">{recipe.category}</span>
                )}

                <div className="recipe-info">
                    <h3>{recipe.name}</h3>
                    <div className="recipe-meta">
                        <span className="recipe-time">⏱ {recipe.time} min</span>
                        {recipe.nutrition?.calories && (
                            <span className="recipe-calories">
                                🔥 {recipe.nutrition.calories} kcal
                            </span>
                        )}
                        <span
                            className="difficulty-badge"
                            style={{ backgroundColor: colors.bg, color: colors.text }}
                        >
                            {recipe.difficulty}
                        </span>
                    </div>

                    <button
                        className={inCart ? 'cart-btn cart-btn-added' : 'cart-btn'}
                        onClick={handleCartToggle}
                    >
                        {inCart ? '✓ În lista de cumpărături' : '+ Adaugă pe listă'}
                    </button>
                </div>
            </div>
        </Link>
    );
}