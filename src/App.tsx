import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChefHat, Flame, Leaf, Drumstick, UtensilsCrossed } from 'lucide-react';
import { recipes, regionColors, regionEmojis } from './data/recipes';
import type { Region, Recipe } from './data/recipes';
import RecipeCard from './components/RecipeCard';
import RecipeModal from './components/RecipeModal';

const regions: (Region | 'All')[] = ['All', 'North', 'South', 'East', 'West', 'Northeast', 'Central'];

type DietFilter = 'All' | 'Veg' | 'Non-Veg';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<Region | 'All'>('All');
  const [dietFilter, setDietFilter] = useState<DietFilter>('All');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHero, setShowHero] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowHero(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesSearch =
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === 'All' || recipe.region === selectedRegion;
      const matchesDiet =
        dietFilter === 'All' ||
        (dietFilter === 'Veg' && recipe.isVeg) ||
        (dietFilter === 'Non-Veg' && !recipe.isVeg);
      return matchesSearch && matchesRegion && matchesDiet;
    });
  }, [searchQuery, selectedRegion, dietFilter]);

  const openRecipe = useCallback((recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  }, []);

  const closeRecipe = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedRecipe(null), 300);
  }, []);

  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = { All: recipes.length };
    recipes.forEach((r) => {
      counts[r.region] = (counts[r.region] || 0) + 1;
    });
    return counts;
  }, []);

  const stats = useMemo(() => ({
    total: recipes.length,
    veg: recipes.filter(r => r.isVeg).length,
    nonVeg: recipes.filter(r => !r.isVeg).length,
    regions: new Set(recipes.map(r => r.region)).size,
    states: new Set(recipes.map(r => r.state)).size,
  }), []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pattern-overlay">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#e8a838]/8 via-transparent to-transparent" />
        
        {/* Floating food emojis in background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {['🍛', '🥘', '🍲', '🫓', '🌶️', '🥥', '🍚', '🧀'].map((emoji, i) => (
            <motion.span
              key={i}
              className="absolute text-2xl sm:text-3xl opacity-10"
              style={{
                left: `${10 + (i * 12) % 85}%`,
                top: `${15 + (i * 17) % 60}%`,
              }}
              animate={{
                y: [0, -15, 0, 10, 0],
                rotate: [0, 5, -5, 3, 0],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.5,
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-14 pb-6 sm:pb-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: showHero ? 1 : 0, y: showHero ? 0 : 30 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {/* Logo / Brand */}
            <motion.div
              className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-white/5 border border-white/10"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <UtensilsCrossed size={18} className="text-[var(--accent)]" />
              <span className="text-sm font-medium text-[var(--text-secondary)]">Generate Authentic Indian Recipes</span>
            </motion.div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">
              <span className="gradient-text">Indi</span>
              <span className="text-[var(--text-primary)]">Recipe</span>
            </h1>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-2">
              Your indie recipe generator for authentic Indian cuisine
            </p>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]/60 max-w-lg mx-auto mb-8">
              {stats.total} handpicked recipes • {stats.states} states • {stats.regions} regions
            </p>

            {/* Stats bar */}
            <motion.div
              className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                  <ChefHat size={16} className="text-[var(--accent)]" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-[var(--text-primary)]">{stats.total}</div>
                  <div className="text-[var(--text-secondary)] text-[10px]">Recipes</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Leaf size={16} className="text-green-400" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-[var(--text-primary)]">{stats.veg}</div>
                  <div className="text-[var(--text-secondary)] text-[10px]">Vegetarian</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <Drumstick size={16} className="text-red-400" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-[var(--text-primary)]">{stats.nonVeg}</div>
                  <div className="text-[var(--text-secondary)] text-[10px]">Non-Veg</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Flame size={16} className="text-purple-400" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-[var(--text-primary)]">{stats.regions}</div>
                  <div className="text-[var(--text-secondary)] text-[10px]">Regions</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* Sticky Search & Filter Bar */}
      <div className="sticky top-0 z-40 bg-[var(--bg-primary)]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto mb-4">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by dish name, state, or description..."
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 text-sm focus:outline-none focus:border-[var(--accent)]/40 focus:ring-1 focus:ring-[var(--accent)]/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Region Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            {regions.map((region) => {
              const isActive = selectedRegion === region;
              const color = region === 'All' ? '#e8a838' : regionColors[region as Region];
              return (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`region-pill inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'text-white shadow-lg active'
                      : 'text-[var(--text-secondary)] bg-white/5 hover:bg-white/10'
                  }`}
                  style={isActive ? { background: color } : {}}
                >
                  <span>{region === 'All' ? '🇮🇳' : regionEmojis[region as Region]}</span>
                  <span>{region}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20' : 'bg-white/5'
                  }`}>
                    {regionCounts[region] || 0}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Diet Filter */}
          <div className="flex justify-center gap-2">
            {(['All', 'Veg', 'Non-Veg'] as DietFilter[]).map((diet) => {
              const isActive = dietFilter === diet;
              return (
                <button
                  key={diet}
                  onClick={() => setDietFilter(diet)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? diet === 'Veg'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : diet === 'Non-Veg'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-white/10 text-[var(--text-primary)] border border-white/20'
                      : 'text-[var(--text-secondary)] bg-white/3 border border-transparent hover:bg-white/5'
                  }`}
                >
                  {diet === 'Veg' && <Leaf size={11} />}
                  {diet === 'Non-Veg' && <Drumstick size={11} />}
                  {diet === 'All' && '🍽️'}
                  {diet}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recipe Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Results count */}
        <motion.div
          className="flex items-center justify-between mb-6"
          layout
        >
          <p className="text-sm text-[var(--text-secondary)]">
            Showing <span className="text-[var(--text-primary)] font-semibold">{filteredRecipes.length}</span>{' '}
            {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
            {selectedRegion !== 'All' && (
              <span> from <span className="font-semibold" style={{ color: regionColors[selectedRegion] }}>{selectedRegion} India</span></span>
            )}
            {searchQuery && (
              <span> matching "<span className="text-[var(--accent)]">{searchQuery}</span>"</span>
            )}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {filteredRecipes.length > 0 ? (
            <motion.div
              key={`${selectedRegion}-${dietFilter}-${searchQuery}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filteredRecipes.map((recipe, index) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => openRecipe(recipe)}
                  index={index}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center py-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-2">
                No recipes found
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRegion('All');
                  setDietFilter('All');
                }}
                className="px-4 py-2 rounded-lg bg-[var(--accent)] text-black text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-bold">
                <span className="gradient-text">Indi</span>
                <span className="text-[var(--text-primary)]">Recipe</span>
              </span>
              <span className="text-xs text-[var(--text-secondary)]">• Your Indian Recipe Generator</span>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {(Object.keys(regionColors) as Region[]).map((region) => (
                <span
                  key={region}
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ background: `${regionColors[region]}15`, color: regionColors[region] }}
                >
                  {regionEmojis[region]} {region}
                </span>
              ))}
            </div>
            <p className="text-xs text-[var(--text-secondary)]/60">
              {recipes.length} authentic recipes from {stats.states} states
            </p>
          </div>
        </div>
      </footer>

      {/* Recipe Modal */}
      <RecipeModal
        recipe={selectedRecipe}
        isOpen={isModalOpen}
        onClose={closeRecipe}
      />
    </div>
  );
}

export default App;
