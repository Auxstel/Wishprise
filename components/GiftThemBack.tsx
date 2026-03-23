import React, { useState } from 'react';
import { GiftCategory, giftProducts, GIFT_CATEGORIES, AFFILIATE_DISCLOSURE } from '../data/giftProducts';

interface GiftThemBackProps {
  defaultExpanded?: boolean;
}

export const GiftThemBack: React.FC<GiftThemBackProps> = ({ defaultExpanded = false }) => {
  const [selectedCategory, setSelectedCategory] = useState<GiftCategory | 'all'>('all');
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const filteredProducts = selectedCategory === 'all'
    ? giftProducts
    : giftProducts.filter((product) => product.category.includes(selectedCategory));

  return (
    <div className="pt-12 pb-8 border-t border-white/5 mt-12 animate-fade-in delay-500">
      <div className="bg-gradient-to-br from-magical-900/30 to-slate-900/30 p-6 md:p-8 rounded-[32px] border border-white/10">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between group"
        >
          <div className="text-left">
            <h3 className="text-2xl font-serif text-white flex items-center gap-3">
              <span className="text-3xl">💝</span>
              Gift Them Back
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Perfect gift ideas for your special someone
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:bg-magical-500/30">
            <span className={`text-xl transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </div>
        </button>

        {isExpanded && (
          <div className="mt-8 space-y-6 animate-fade-in-up">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === 'all'
                    ? 'bg-magical-500 text-white shadow-lg shadow-magical-500/30'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                🎉 All
              </button>
              {(Object.keys(GIFT_CATEGORIES) as GiftCategory[]).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-magical-500 text-white shadow-lg shadow-magical-500/30'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {GIFT_CATEGORIES[category].emoji} {GIFT_CATEGORIES[category].label.replace('For ', '')}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredProducts.map((product) => (
                <a
                  key={product.id}
                  href={product.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-magical-500/50 transition-all duration-300 hover:bg-white/10"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-white/60 text-[10px] uppercase tracking-wider font-bold mb-1">
                        {product.category.map(cat => GIFT_CATEGORIES[cat]?.label.split(' ').pop()).join(' • ')}
                      </p>
                      <p className="text-white font-medium truncate group-hover:text-magical-200 transition-colors">
                        {product.name}
                      </p>
                      <p className="text-magical-300 text-xs italic mt-1">
                        "{product.quote}"
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-white font-bold whitespace-nowrap">₹{product.price.toLocaleString()}</span>
                      <span className="text-xs text-magical-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        View Gift →
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <p className="text-center text-white/30 text-[10px] italic pt-4">
              {AFFILIATE_DISCLOSURE}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftThemBack;