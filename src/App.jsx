import { BrowserRouter, Routes, Route } from 'react-router';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import './App.css';

export default function App() {
  return (
    <FavoritesProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/recipe/:id" element={<RecipeDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/favorites" element={<Favorites />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </CartProvider>
    </FavoritesProvider>
  );
}