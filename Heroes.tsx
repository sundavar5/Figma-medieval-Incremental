import type { Hero, Resources } from '../App';
import { Star, Lock } from 'lucide-react';

interface HeroesProps {
  heroes: Hero[];
  resources: Resources;
  onUpgrade: (heroId: string) => void;
}

export function Heroes({ heroes, resources, onUpgrade }: HeroesProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return Math.floor(num).toLocaleString();
  };

  const getCost = (hero: Hero) => {
    const multiplier = hero.unlocked ? Math.pow(1.5, hero.level) : 1;
    return Object.entries(hero.cost).map(([resource, cost]) => ({
      resource,
      amount: Math.floor(cost * multiplier)
    }));
  };

  const canAfford = (hero: Hero) => {
    const costs = getCost(hero);
    return costs.every(({ resource, amount }) => 
      resources[resource as keyof Resources] >= amount
    );
  };

  return (
    <div className="bg-gradient-to-br from-amber-900 to-orange-950 rounded-lg shadow-2xl p-6 border-2 border-amber-600">
      <h2 className="text-white mb-4">Heroes</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {heroes.map(hero => {
          const costs = getCost(hero);
          const affordable = canAfford(hero);

          return (
            <div
              key={hero.id}
              className={`rounded-lg p-4 border-2 transition-all ${
                affordable
                  ? 'bg-amber-800 border-yellow-500 hover:border-yellow-400 cursor-pointer hover:scale-105'
                  : 'bg-amber-950 border-amber-700 opacity-70 cursor-not-allowed'
              }`}
              onClick={() => affordable && onUpgrade(hero.id)}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="text-5xl relative">
                  {hero.icon}
                  {!hero.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lock className="w-8 h-8 text-slate-800 opacity-70" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-white">{hero.name}</h3>
                  <p className="text-amber-300 text-sm">{hero.description}</p>
                  {hero.unlocked && (
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(hero.level)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-amber-700 pt-3 space-y-2">
                <div className="text-sm">
                  <div className="text-amber-400 mb-1">Bonus:</div>
                  <div className="text-green-400">{hero.bonus}</div>
                  {hero.level > 0 && (
                    <div className="text-yellow-300 mt-1">
                      Current: Level {hero.level} ({(hero.level * (hero.id === 'king' ? 25 : hero.id === 'merchant' || hero.id === 'priest' || hero.id === 'wizard' ? 100 : hero.id === 'scholar' ? 75 : 50))}% boost)
                    </div>
                  )}
                </div>

                <div className="text-sm">
                  <div className="text-amber-400 mb-1">
                    {hero.unlocked ? `Cost to level up (Lv ${hero.level + 1}):` : 'Cost to recruit:'}
                  </div>
                  {costs.map(({ resource, amount }) => {
                    const has = resources[resource as keyof Resources];
                    const enough = has >= amount;
                    return (
                      <div 
                        key={resource}
                        className={`flex items-center justify-between ${enough ? 'text-amber-200' : 'text-red-400'}`}
                      >
                        <span>{resource}:</span>
                        <span>{formatNumber(amount)} ({formatNumber(has)})</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {hero.unlocked && (
                <div className="mt-3 p-2 bg-yellow-900 bg-opacity-30 rounded border border-yellow-700">
                  <div className="text-yellow-300 text-sm flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400" />
                    Active Hero
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-amber-950 bg-opacity-50 rounded-lg border border-amber-700">
        <p className="text-amber-200 text-sm">
          ⭐ Heroes provide powerful permanent bonuses. Level them up to increase their power!
        </p>
      </div>
    </div>
  );
}
