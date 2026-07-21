import { motion } from 'framer-motion';
import { Clock, MapPin, Leaf, Drumstick } from 'lucide-react';
import type { Recipe } from '../data/recipes';
import { regionColors } from '../data/recipes';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  index: number;
}

const spiceLevelColors = ['', '#4ade80', '#facc15', '#f97316', '#ef4444', '#dc2626'];

export default function RecipeCard({ recipe, onClick, index }: RecipeCardProps) {
  const regionColor = regionColors[recipe.region];

  return (
    <motion.div
      className="recipe-card cursor-pointer rounded-2xl overflow-hidden bg-[#1e1e1e] border border-white/5 group"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.8), duration: 0.4, ease: 'easeOut' }}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {/* Top section with emoji */}
      <div
        className="relative p-6 pb-4 overflow-hidden"
        style={{
          background: `linear-gradient(145deg, ${regionColor}18, ${regionColor}06)`,
        }}
      >
        {/* Region badge */}
        <div
          className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-semibold text-white"
          style={{ background: regionColor }}
        >
          {recipe.region}
        </div>

        {/* Veg/Non-veg indicator */}
        <div className={`absolute top-3 left-3 w-5 h-5 rounded border-2 flex items-center justify-center ${
          recipe.isVeg ? 'border-green-500' : 'border-red-500'
        }`}>
          <div className={`w-2.5 h-2.5 rounded-full ${
            recipe.isVeg ? 'bg-green-500' : 'bg-red-500'
          }`} />
        </div>

        {/* Emoji */}
        <div className="text-5xl mb-2 group-hover:scale-110 transition-transform duration-300 pt-4">
          {recipe.image}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-2">
        <h3 className="font-display text-lg font-bold text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent)] transition-colors line-clamp-1">
          {recipe.name}
        </h3>

        <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)] mb-3">
          <MapPin size={11} />
          <span>{recipe.state}</span>
        </div>

        <p className="text-xs text-[var(--text-secondary)] mb-3 line-clamp-2 leading-relaxed">
          {recipe.description}
        </p>

        {/* Bottom info */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
            <Clock size={12} />
            <span>{recipe.cookTime}</span>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: level <= recipe.spiceLevel
                    ? spiceLevelColors[recipe.spiceLevel]
                    : 'rgba(255,255,255,0.1)',
                }}
              />
            ))}
          </div>

          <div className={`text-xs flex items-center gap-1 ${recipe.isVeg ? 'text-green-400' : 'text-red-400'}`}>
            {recipe.isVeg ? <Leaf size={11} /> : <Drumstick size={11} />}
            <span>{recipe.isVeg ? 'Veg' : 'Non-Veg'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
