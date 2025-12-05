import { Users, Wheat, Trees, Mountain, Anvil, BookOpen, Coins, Sparkles, Church, Gem } from 'lucide-react';
import type { Resources } from '../App';

interface ResourcePanelProps {
  resources: Resources;
  production: Resources;
}

export function ResourcePanel({ resources, production }: ResourcePanelProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return Math.floor(num).toLocaleString();
  };

  const formatProduction = (num: number) => {
    if (num >= 1000) return `+${(num).toFixed(1)}/s`;
    if (num >= 1) return `+${num.toFixed(2)}/s`;
    return num >= 0.01 ? `+${num.toFixed(2)}/s` : '+0.00/s';
  };

  const resourceData = [
    { key: 'population' as keyof Resources, label: 'Population', icon: Users, color: 'from-blue-500 to-blue-700' },
    { key: 'food' as keyof Resources, label: 'Food', icon: Wheat, color: 'from-green-500 to-green-700' },
    { key: 'wood' as keyof Resources, label: 'Wood', icon: Trees, color: 'from-amber-600 to-amber-800' },
    { key: 'stone' as keyof Resources, label: 'Stone', icon: Mountain, color: 'from-gray-500 to-gray-700' },
    { key: 'iron' as keyof Resources, label: 'Iron', icon: Anvil, color: 'from-slate-400 to-slate-600' },
    { key: 'gold' as keyof Resources, label: 'Gold', icon: Coins, color: 'from-yellow-500 to-yellow-700' },
    { key: 'mana' as keyof Resources, label: 'Mana', icon: Sparkles, color: 'from-purple-500 to-purple-700' },
    { key: 'knowledge' as keyof Resources, label: 'Knowledge', icon: BookOpen, color: 'from-cyan-500 to-cyan-700' },
    { key: 'faith' as keyof Resources, label: 'Faith', icon: Church, color: 'from-pink-500 to-pink-700' },
    { key: 'gems' as keyof Resources, label: 'Gems', icon: Gem, color: 'from-emerald-500 to-emerald-700' }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-xl p-4 border-2 border-slate-600">
      <h2 className="text-white mb-4">Resources</h2>
      
      <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar pr-2">
        {resourceData.map(({ key, label, icon: Icon, color }) => {
          const value = resources[key];
          const prod = production[key];
          
          // Don't show resources that are completely zero
          if (value === 0 && prod === 0 && key !== 'population' && key !== 'food' && key !== 'wood' && key !== 'stone' && key !== 'knowledge') {
            return null;
          }

          return (
            <div 
              key={key}
              className="bg-slate-700 bg-opacity-50 rounded-lg p-2 border border-slate-600"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded bg-gradient-to-br ${color}`}>
                    <Icon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-slate-200 text-sm">{label}</span>
                </div>
                <span className="text-white">
                  {formatNumber(value)}
                </span>
              </div>
              {prod > 0 && (
                <div className="text-right text-green-400 text-xs">
                  {formatProduction(prod)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-2 bg-purple-900 bg-opacity-30 rounded-lg border border-purple-700">
        <p className="text-purple-200 text-xs">
          💡 Unlock skills to gain new resources!
        </p>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.7);
        }
      `}</style>
    </div>
  );
}
