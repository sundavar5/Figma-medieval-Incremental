import type { Building, Resources } from '../App';

interface BuildingsProps {
  buildings: Building[];
  resources: Resources;
  onUpgrade: (buildingId: string) => void;
}

export function Buildings({ buildings, resources, onUpgrade }: BuildingsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return Math.floor(num).toLocaleString();
  };

  const getCost = (building: Building) => {
    const multiplier = Math.pow(1.15, building.level);
    return Object.entries(building.baseCost).map(([resource, cost]) => ({
      resource,
      amount: Math.floor(cost * multiplier)
    }));
  };

  const canAfford = (building: Building) => {
    const costs = getCost(building);
    return costs.every(({ resource, amount }) => 
      resources[resource as keyof Resources] >= amount
    );
  };

  const categories = [
    { id: 'economy', name: 'Economy', color: 'from-green-600 to-emerald-700' },
    { id: 'technology', name: 'Technology', color: 'from-blue-600 to-cyan-700' },
    { id: 'military', name: 'Military', color: 'from-red-600 to-rose-700' },
    { id: 'magic', name: 'Magic', color: 'from-purple-600 to-violet-700' },
    { id: 'divine', name: 'Divine', color: 'from-yellow-600 to-amber-700' }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-2xl p-6 border-2 border-slate-600">
      <h2 className="text-white mb-4">Buildings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {buildings.map(building => {
          const costs = getCost(building);
          const affordable = canAfford(building);
          const category = categories.find(c => c.id === building.category);

          return (
            <div
              key={building.id}
              className={`rounded-lg p-4 border-2 transition-all ${
                affordable
                  ? 'bg-slate-700 border-green-500 hover:border-green-400 cursor-pointer hover:scale-105'
                  : 'bg-slate-800 border-slate-600 opacity-70 cursor-not-allowed'
              }`}
              onClick={() => affordable && onUpgrade(building.id)}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="text-4xl">{building.icon}</div>
                <div className="flex-1">
                  <h3 className="text-white">{building.name}</h3>
                  <p className="text-slate-400 text-sm">{building.description}</p>
                  <div className={`inline-block mt-1 px-2 py-0.5 rounded text-xs bg-gradient-to-r ${category?.color || 'from-gray-600 to-gray-700'}`}>
                    <span className="text-white">Level {building.level}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-600 pt-3 space-y-2">
                <div className="text-sm">
                  <div className="text-slate-400 mb-1">Production per level:</div>
                  {Object.entries(building.production).map(([resource, amount]) => (
                    <div key={resource} className="text-green-400 flex items-center justify-between">
                      <span>{resource}:</span>
                      <span>+{amount.toFixed(2)}/s</span>
                    </div>
                  ))}
                  {building.id === 'workshop' && (
                    <div className="text-purple-400">+5% all production</div>
                  )}
                </div>

                <div className="text-sm">
                  <div className="text-slate-400 mb-1">Cost to upgrade:</div>
                  {costs.map(({ resource, amount }) => {
                    const has = resources[resource as keyof Resources];
                    const enough = has >= amount;
                    return (
                      <div 
                        key={resource}
                        className={`flex items-center justify-between ${enough ? 'text-slate-300' : 'text-red-400'}`}
                      >
                        <span>{resource}:</span>
                        <span>{formatNumber(amount)} ({formatNumber(has)})</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {building.level > 0 && (
                <div className="mt-3 p-2 bg-green-900 bg-opacity-30 rounded border border-green-700">
                  <div className="text-green-300 text-sm">
                    Current: +{Object.entries(building.production).map(([r, p]) => 
                      `${(p * building.level).toFixed(2)} ${r}/s`
                    ).join(', ')}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-slate-950 bg-opacity-50 rounded-lg border border-slate-700">
        <p className="text-slate-300 text-sm">
          💡 Buildings provide passive resource generation. Costs increase by 15% per level.
        </p>
      </div>
    </div>
  );
}
