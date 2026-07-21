import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Flame, MapPin, ChefHat, Leaf, Drumstick, ExternalLink, Play } from 'lucide-react';
import type { Recipe } from '../data/recipes';
import { regionColors } from '../data/recipes';

interface RecipeModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

const spiceLevelLabels = ['', 'Mild', 'Medium', 'Spicy', 'Very Spicy', 'Extreme'];
const spiceLevelColors = ['', '#4ade80', '#facc15', '#f97316', '#ef4444', '#dc2626'];

export default function RecipeModal({ recipe, isOpen, onClose }: RecipeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!recipe) return null;

  const regionColor = regionColors[recipe.region];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 modal-backdrop flex items-start justify-center overflow-y-auto py-4 px-4 sm:py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={modalRef}
            className="w-full max-w-3xl bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl border border-white/5 my-auto"
            initial={{ scale: 0.9, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header with emoji and gradient */}
            <div
              className="relative p-6 sm:p-8 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${regionColor}22, ${regionColor}08)`,
              }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                <X size={20} className="text-white" />
              </button>

              {/* Floating emoji */}
              <motion.div
                className="text-7xl sm:text-8xl mb-4 float-emoji inline-block"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 10, delay: 0.2 }}
              >
                {recipe.image}
              </motion.div>

              <motion.h2
                className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-3"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                {recipe.name}
              </motion.h2>

              <motion.p
                className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed max-w-xl"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {recipe.description}
              </motion.p>

              {/* Tags */}
              <motion.div
                className="flex flex-wrap items-center gap-3 mt-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                  style={{ background: regionColor }}
                >
                  <MapPin size={12} />
                  {recipe.state} • {recipe.region}
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 text-[var(--text-primary)]">
                  <Clock size={12} />
                  {recipe.cookTime}
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 text-[var(--text-primary)]">
                  <Flame size={12} style={{ color: spiceLevelColors[recipe.spiceLevel] }} />
                  {spiceLevelLabels[recipe.spiceLevel]}
                </span>

                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${recipe.isVeg ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                  {recipe.isVeg ? <Leaf size={12} /> : <Drumstick size={12} />}
                  {recipe.isVeg ? 'Vegetarian' : 'Non-Veg'}
                </span>
              </motion.div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* Spice Level Visual */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Flame size={16} className="text-orange-400" />
                  <span className="text-sm font-medium text-[var(--text-secondary)]">Spice Level</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <motion.div
                      key={level}
                      className="w-8 h-2 rounded-full"
                      style={{
                        background: level <= recipe.spiceLevel ? spiceLevelColors[recipe.spiceLevel] : 'rgba(255,255,255,0.1)',
                      }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.3 + level * 0.05 }}
                    />
                  ))}
                  <span className="ml-2 text-xs text-[var(--text-secondary)]">{recipe.spiceLevel}/5</span>
                </div>
              </motion.div>

              {/* Ingredients */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <h3 className="font-display text-xl font-semibold text-[var(--accent)] mb-4 flex items-center gap-2">
                  🧂 Ingredients
                  <span className="text-xs font-normal text-[var(--text-secondary)] bg-white/5 px-2 py-0.5 rounded-full">
                    {recipe.ingredients.length} items
                  </span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <motion.div
                      key={index}
                      className="ingredient-item flex items-start gap-2 p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: regionColor }} />
                      <span className="text-sm text-[var(--text-primary)]">{ingredient}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="font-display text-xl font-semibold text-[var(--accent)] mb-4">
                  👨‍🍳 Cooking Instructions
                </h3>
                <div className="space-y-4">
                  {recipe.steps.map((step, index) => (
                    <motion.div
                      key={index}
                      className="flex gap-4"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.06 }}
                    >
                      <div
                        className="step-circle flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                        style={{ background: regionColor, animationDelay: `${index * 0.06}s` }}
                      >
                        {index + 1}
                      </div>
                      <p className="text-sm text-[var(--text-primary)] leading-relaxed pt-1">{step}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Chef's Tip */}
              <motion.div
                className="relative p-5 rounded-xl overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${regionColor}15, ${regionColor}05)` }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <ChefHat size={24} style={{ color: regionColor }} />
                  </div>
                  <div>
                    <h4 className="font-display text-base font-semibold text-[var(--accent)] mb-1">Chef's Tip</h4>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{recipe.chefTip}</p>
                  </div>
                </div>
              </motion.div>

              {/* YouTube Link */}
              <motion.a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${recipe.name} recipe ${recipe.state} Indian`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Play size={24} className="text-white fill-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Watch "{recipe.name}" on YouTube</p>
                  <p className="text-xs text-red-300/70">See real video tutorials from top Indian chefs</p>
                </div>
                <ExternalLink size={16} className="text-red-300/50 group-hover:text-red-300 transition-colors" />
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
