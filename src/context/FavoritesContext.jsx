import { useReducer, useEffect } from 'react';
import { FavoritesContext } from './favoritesContextObject';

const STORAGE_KEY = 'gourmet-explorer-favorites';

const initialState = {
    favorites: [],
};

function init() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : initialState;
    } catch {
        return initialState;
    }
}

function favoritesReducer(state, action) {
    switch (action.type) {
        case 'ADD_FAVORITE': {
            const exists = state.favorites.some((r) => r.id === action.payload.recipe.id);
            if (exists) return state;
            return {
                ...state,
                favorites: [...state.favorites, action.payload.recipe],
            };
        }

        case 'REMOVE_FAVORITE': {
            return {
                ...state,
                favorites: state.favorites.filter((r) => r.id !== action.payload.recipeId),
            };
        }

        case 'TOGGLE_FAVORITE': {
            const exists = state.favorites.some((r) => r.id === action.payload.recipe.id);
            if (exists) {
                return {
                    ...state,
                    favorites: state.favorites.filter((r) => r.id !== action.payload.recipe.id),
                };
            }
            return {
                ...state,
                favorites: [...state.favorites, action.payload.recipe],
            };
        }

        case 'CLEAR_FAVORITES': {
            return { ...state, favorites: [] };
        }

        default:
            return state;
    }
}

export function FavoritesProvider({ children }) {
    const [state, dispatch] = useReducer(favoritesReducer, initialState, init);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (err) {
            console.error('Eroare la salvarea favoritelor:', err);
        }
    }, [state]);

    const addFavorite = (recipe) =>
        dispatch({ type: 'ADD_FAVORITE', payload: { recipe } });

    const removeFavorite = (recipeId) =>
        dispatch({ type: 'REMOVE_FAVORITE', payload: { recipeId } });

    const toggleFavorite = (recipe) =>
        dispatch({ type: 'TOGGLE_FAVORITE', payload: { recipe } });

    const clearFavorites = () => dispatch({ type: 'CLEAR_FAVORITES' });

    const isFavorite = (recipeId) =>
        state.favorites.some((r) => r.id === recipeId);

    const favoritesCount = state.favorites.length;

    return (
        <FavoritesContext.Provider
            value={{
                favorites: state.favorites,
                addFavorite,
                removeFavorite,
                toggleFavorite,
                clearFavorites,
                isFavorite,
                favoritesCount,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
}