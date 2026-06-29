import { useState, useMemo } from 'react';
import RecipeCard from '../components/RecipeCard';
import recipesData from '../data/recipes.json';

const DIFFICULTY_RANK = { 'Ușor': 1, 'Mediu': 2, 'Greu': 3 };

export default function Home() {
    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('Toate');
    const [categoryFilter, setCategoryFilter] = useState('Toate');
    const [activeTags, setActiveTags] = useState([]);
    const [sortOrder, setSortOrder] = useState('default');

    const categories = useMemo(
        () => ['Toate', ...new Set(recipesData.map((r) => r.category))],
        []
    );

    const allTags = useMemo(
        () => [...new Set(recipesData.flatMap((r) => r.tags || []))].sort(),
        []
    );

    const toggleTag = (tag) => {
        setActiveTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const filteredRecipes = recipesData.filter((recipe) => {
        const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDifficulty =
            difficultyFilter === 'Toate' || recipe.difficulty === difficultyFilter;
        const matchesCategory =
            categoryFilter === 'Toate' || recipe.category === categoryFilter;
        const matchesTags =
            activeTags.length === 0 ||
            activeTags.every((t) => (recipe.tags || []).includes(t));
        return matchesSearch && matchesDifficulty && matchesCategory && matchesTags;
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
            case 'lightest':
                return (a.nutrition?.calories || 0) - (b.nutrition?.calories || 0);
            default:
                return 0;
        }
    });

    const clearFilters = () => {
        setSearchTerm('');
        setDifficultyFilter('Toate');
        setCategoryFilter('Toate');
        setActiveTags([]);
        setSortOrder('default');
    };

    const hasActiveFilters =
        searchTerm || difficultyFilter !== 'Toate' || categoryFilter !== 'Toate' ||
        activeTags.length > 0 || sortOrder !== 'default';

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
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    {categories.map((c) => (
                        <option key={c} value={c}>
                            {c === 'Toate' ? 'Toate categoriile' : c}
                        </option>
                    ))}
                </select>

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
                    <option value="lightest">Cele mai puține calorii</option>
                </select>
            </div>

            <div className="tag-filter">
                {allTags.map((tag) => (
                    <button
                        key={tag}
                        className={
                            activeTags.includes(tag) ? 'tag-pill tag-pill-active' : 'tag-pill'
                        }
                        onClick={() => toggleTag(tag)}
                    >
                        #{tag}
                    </button>
                ))}
            </div>

            {hasActiveFilters && (
                <div className="reset-filters-row">
                    <button className="tag-pill tag-pill-clear" onClick={clearFilters}>
                        ✕ Resetează filtrele
                    </button>
                </div>
            )}

            <p className="results-count">
                {sortedRecipes.length}{' '}
                {sortedRecipes.length === 1 ? 'rețetă găsită' : 'rețete găsite'}
            </p>

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