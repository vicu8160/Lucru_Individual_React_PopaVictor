import { useContext } from 'react';
import { FavoritesContext } from './favoritesContextObject';

export function useFavorites() {
    const ctx = useContext(FavoritesContext);
    if (!ctx) {
        throw new Error('useFavorites trebuie folosit în interiorul FavoritesProvider');
    }
    return ctx;
}