import { useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import recipesData from '../data/recipes.json';

const DIFFICULTY_RANK = { 'Ușor': 1, 'Mediu': 2, 'Greu': 3 };

export default function Home() {
    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('Toate');
    const [sortOrder, setSortOrder] = useState('default');

    const filteredRecipes = recipesData.filter((recipe) => {
        const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDifficulty =
            difficultyFilter === 'Toate' || recipe.difficulty === difficultyFilter;
        return matchesSearch && matchesDifficulty;
    });

    const sortedRecipes = [...filteredRecipes].sort((a, b) => {
        switch (sortOrder) {
            case 'quickest':
                return a.time - b.time;
            case 'longest':
                return b.time - a.time;
            case 'az':
                return a.name.localeCompare(b.name);
            case 'za':
                return b.name.localeCompare(a.name);
            case 'easiest':
                return DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty];
            case 'hardest':
                return DIFFICULTY_RANK[b.difficulty] - DIFFICULTY_RANK[a.difficulty];
            default:
                return 0;
        }
    });

    return (
        <div className="page-container">
            <header className="header">
                <h1>👨‍🍳 Gourmet Explorer</h1>
                <p>Descoperă rețete delicioase și creează-ți lista de cumpărături</p>
            </header>

            <div className="toolbar">
                <input
                    className="search-input"
                    type="text"
                    placeholder="Caută rețete..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    className="filter-select"
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                >
                    <option value="Toate">Toate dificultățile</option>
                    <option value="Ușor">Ușor</option>
                    <option value="Mediu">Mediu</option>
                    <option value="Greu">Greu</option>
                </select>

                <select
                    className="filter-select"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="default">Sortează după...</option>
                    <option value="quickest">De la cel mai scurt la cel mai lung</option>
                    <option value="longest">De la cel mai lung la cel mai scurt</option>
                    <option value="az">A - Z</option>
                    <option value="za">Z - A</option>
                    <option value="easiest">De la cel mai ușor la cel mai greu</option>
                    <option value="hardest">De la cel mai greu la cel mai ușor</option>
                </select>
            </div>

            <div className="recipe-grid">
                {sortedRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
            </div>

            {sortedRecipes.length === 0 && (
                <div className="empty-state">
                    <h3>Nicio rețetă găsită</h3>
                    <p>Încearcă să modifici căutarea sau filtrele.</p>
                </div>
            )}
        </div>
    );
}