import { useParams, Link, useNavigate } from 'react-router';
import { useCart } from '../context/useCart';
import { useFavorites } from '../context/useFavorites';
import recipesData from '../data/recipes.json';

const DIFFICULTY_COLORS = {
    'Ușor': { bg: '#dcfce7', text: '#166534' },
    'Mediu': { bg: '#fef9c3', text: '#854d0e' },
    'Greu': { bg: '#fee2e2', text: '#991b1b' },
};

export default function RecipeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isInCart, addRecipe, removeRecipe } = useCart();
    const { isFavorite, toggleFavorite } = useFavorites();

    const recipe = recipesData.find((r) => r.id === Number(id));

    if (!recipe) {
        return (
            <div className="page-container">
                <div className="empty-state">
                    <h2>Rețetă inexistentă 🍽️</h2>
                    <p>Rețeta pe care o cauți nu există.</p>
                    <Link to="/" className="back-link">← Înapoi la rețete</Link>
                </div>
            </div>
        );
    }

    const inCart = isInCart(recipe.id);
    const fav = isFavorite(recipe.id);
    const colors = DIFFICULTY_COLORS[recipe.difficulty];

    const handleCartToggle = () => {
        if (inCart) {
            removeRecipe(recipe.id);
        } else {
            addRecipe(recipe);
        }
    };

    const handleFavoriteToggle = () => {
        toggleFavorite(recipe);
    };

    return (
        <div className="page-container">
            <button onClick={() => navigate(-1)} className="back-button">
                ← Înapoi
            </button>

            <article className="recipe-detail">
                <div className="detail-hero">
                    <img src={recipe.image} alt={recipe.name} className="detail-image" />
                    <div className="detail-overlay" />
                </div>

                <div className="detail-content">
                    <h1 className="detail-title">{recipe.name}</h1>
                    <p className="detail-description">{recipe.description}</p>

                    <div className="detail-stats">
                        <div className="stat-card">
                            <span className="stat-icon">⏱</span>
                            <span className="stat-label">Timp</span>
                            <span className="stat-value">{recipe.time} min</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-icon">📊</span>
                            <span className="stat-label">Dificultate</span>
                            <span
                                className="difficulty-badge"
                                style={{ backgroundColor: colors.bg, color: colors.text }}
                            >
                                {recipe.difficulty}
                            </span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-icon">🍽</span>
                            <span className="stat-label">Porții</span>
                            <span className="stat-value">{recipe.servings}</span>
                        </div>
                    </div>

                    <div className="detail-actions">
                        <button
                            className={inCart ? 'cart-btn-large cart-btn-added' : 'cart-btn-large'}
                            onClick={handleCartToggle}
                        >
                            {inCart ? '✓ Adăugat pe lista de cumpărături' : '+ Adaugă pe lista de cumpărături'}
                        </button>

                        <button
                            className={fav ? 'fav-btn-large fav-btn-active' : 'fav-btn-large'}
                            onClick={handleFavoriteToggle}
                            aria-label={fav ? 'Elimină din favorite' : 'Adaugă la favorite'}
                        >
                            {fav ? '♥' : '♡'}
                        </button>
                    </div>

                    <div className="detail-grid">
                        <section className="ingredients-section">
                            <h2 className="section-title">🥕 Ingrediente</h2>
                            <ul className="ingredients-list">
                                {recipe.ingredients.map((ing, idx) => (
                                    <li key={idx} className="ingredient-item">
                                        <span className="ingredient-amount">
                                            {ing.amount} {ing.unit}
                                        </span>
                                        <span className="ingredient-name">{ing.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="steps-section">
                            <h2 className="section-title">📝 Pași de preparare</h2>
                            <ol className="steps-list">
                                {recipe.steps.map((step, idx) => (
                                    <li key={idx} className="step-item">
                                        <span className="step-number">{idx + 1}</span>
                                        <span className="step-text">{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </section>
                    </div>
                </div>
            </article>
        </div>
    );
}