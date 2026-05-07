import { useReducer, useEffect } from 'react';
import { CartContext } from './cartContextObject';

const STORAGE_KEY = 'gourmet-explorer-cart';

const initialState = {
    selectedRecipes: [],
};

function cartReducer(state, action) {
    switch (action.type) {
        case 'ADD_RECIPE': {
            const exists = state.selectedRecipes.find(
                (item) => item.recipe.id === action.payload.recipe.id
            );
            if (exists) return state;

            return {
                ...state,
                selectedRecipes: [
                    ...state.selectedRecipes,
                    { recipe: action.payload.recipe, servings: action.payload.recipe.servings || 1 },
                ],
            };
        }

        case 'REMOVE_RECIPE': {
            return {
                ...state,
                selectedRecipes: state.selectedRecipes.filter(
                    (item) => item.recipe.id !== action.payload.recipeId
                ),
            };
        }

        case 'UPDATE_SERVINGS': {
            return {
                ...state,
                selectedRecipes: state.selectedRecipes.map((item) =>
                    item.recipe.id === action.payload.recipeId
                        ? { ...item, servings: Math.max(1, action.payload.servings) }
                        : item
                ),
            };
        }

        case 'CLEAR_CART': {
            return { ...state, selectedRecipes: [] };
        }

        case 'HYDRATE': {
            return action.payload || initialState;
        }

        default:
            return state;
    }
}

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                dispatch({ type: 'HYDRATE', payload: JSON.parse(saved) });
            }
        } catch (err) {
            console.error('Failed to load cart from storage:', err);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (err) {
            console.error('Failed to save cart to storage:', err);
        }
    }, [state]);

    const addRecipe = (recipe) =>
        dispatch({ type: 'ADD_RECIPE', payload: { recipe } });

    const removeRecipe = (recipeId) =>
        dispatch({ type: 'REMOVE_RECIPE', payload: { recipeId } });

    const updateServings = (recipeId, servings) =>
        dispatch({ type: 'UPDATE_SERVINGS', payload: { recipeId, servings } });

    const clearCart = () => dispatch({ type: 'CLEAR_CART' });

    const isInCart = (recipeId) =>
        state.selectedRecipes.some((item) => item.recipe.id === recipeId);

    const itemCount = state.selectedRecipes.length;

    return (
        <CartContext.Provider
            value={{
                selectedRecipes: state.selectedRecipes,
                addRecipe,
                removeRecipe,
                updateServings,
                clearCart,
                isInCart,
                itemCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
