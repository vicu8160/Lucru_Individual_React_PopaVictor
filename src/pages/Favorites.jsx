import { Link } from 'react-router';
import RecipeCard from '../components/RecipeCard';
import { useFavorites } from '../context/useFavorites';

export default function Favorites() {
    const { favorites, clearFavorites } = useFavorites();

    if (favorites.length === 0) {
        return (
            <div className="page-container">
                <div className="empty-cart">
                    <div className="empty-cart-icon">♡</div>
                    <h2>Nu ai rețete favorite</h2>
                    <p>Apasă pe inimioara de pe orice rețetă pentru a o salva aici.</p>
                    <Link to="/" className="primary-button">
                        Răsfoiește rețete
                    </Link>
                </div>
            </div>
        );
    }

    const handleClearAll = () => {
        if (window.confirm('Ești sigur că vrei să elimini toate rețetele din favorite?')) {
            clearFavorites();
        }
    };

    return (
        <div className="page-container">
            <header className="header">
                <h1>♥ Rețetele tale favorite</h1>
                <p>{favorites.length} {favorites.length === 1 ? 'rețetă salvată' : 'rețete salvate'}</p>
            </header>

            <div className="favorites-toolbar">
                <button className="clear-btn" onClick={handleClearAll}>
                    Elimină toate favoritele
                </button>
            </div>

            <div className="recipe-grid">
                {favorites.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
            </div>
        </div>
    );
}