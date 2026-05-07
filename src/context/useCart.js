import { useContext } from 'react';
import { CartContext } from './cartContextObject';

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error('useCart must be used inside a CartProvider');
    }
    return ctx;
}
