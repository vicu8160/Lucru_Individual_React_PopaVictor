import { Link, NavLink } from 'react-router';
import { useCart } from '../context/useCart';
import { useFavorites } from '../context/useFavorites';

export default function Navbar() {
    const { itemCount } = useCart();
    const { favoritesCount } = useFavorites();

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <span className="brand-icon">👨‍🍳</span>
                <span className="brand-text">Gourmet Explorer</span>
            </Link>

            <div className="navbar-links">
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                        isActive ? 'nav-link nav-link-active' : 'nav-link'
                    }
                >
                    Rețete
                </NavLink>
                <NavLink
                    to="/favorites"
                    className={({ isActive }) =>
                        isActive ? 'nav-link nav-link-active fav-link' : 'nav-link fav-link'
                    }
                >
                    ♥ Favorite
                    {favoritesCount > 0 && <span className="nav-badge">{favoritesCount}</span>}
                </NavLink>
                <NavLink
                    to="/cart"
                    className={({ isActive }) =>
                        isActive ? 'nav-link nav-link-active cart-link' : 'nav-link cart-link'
                    }
                >
                    🛒 Lista de cumpărături
                    {itemCount > 0 && <span className="nav-badge">{itemCount}</span>}
                </NavLink>
            </div>
        </nav>
    );
}