import { Sparkles, RotateCw, Award } from 'lucide-react';

interface PrestigePanelProps {
  prestigeLevel: number;
  prestigePoints: number;
  totalKnowledge: number;
  onPrestige: () => void;
}

export function PrestigePanel({ prestigeLevel, prestigePoints, totalKnowledge, onPrestige }: PrestigePanelProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return Math.floor(num).toLocaleString();
  };

  const canPrestige = totalKnowledge >= 10000;
  const nextPrestigePoints = Math.max(0, Math.floor(Math.log10(totalKnowledge) - 3));
  const currentBonus = prestigeLevel * 1; // 1% per prestige level

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-lg shadow-2xl p-8 border-2 border-purple-500">
      <div className="flex items-center gap-4 mb-6">
        <Sparkles className="w-12 h-12 text-yellow-400" />
        <div>
          <h2 className="text-white text-3xl">Prestige System</h2>
          <p className="text-purple-200 mt-1">Reset to gain permanent power</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-purple-950 bg-opacity-50 rounded-lg p-6 border-2 border-purple-600">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-6 h-6 text-yellow-400" />
            <h3 className="text-white text-xl">Current Status</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-purple-200">Prestige Level:</span>
              <span className="text-yellow-400 text-xl">{prestigeLevel}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-purple-200">Prestige Points:</span>
              <span className="text-yellow-400 text-xl">{prestigePoints}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-purple-200">Current Bonus:</span>
              <span className="text-green-400 text-xl">+{currentBonus}%</span>
            </div>

            <div className="pt-3 border-t border-purple-700">
              <div className="text-purple-300 text-sm mb-2">Effect:</div>
              <div className="text-green-300">
                +{currentBonus}% to ALL resource production
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-950 bg-opacity-50 rounded-lg p-6 border-2 border-purple-600">
          <div className="flex items-center gap-2 mb-4">
            <RotateCw className="w-6 h-6 text-cyan-400" />
            <h3 className="text-white text-xl">Next Prestige</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-purple-200">Lifetime Knowledge:</span>
              <span className="text-cyan-400 text-xl">{formatNumber(totalKnowledge)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-purple-200">Required:</span>
              <span className={totalKnowledge >= 10000 ? 'text-green-400' : 'text-red-400'}>
                10,000
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-purple-200">Will Gain:</span>
              <span className="text-yellow-400 text-xl">
                {canPrestige ? `+${nextPrestigePoints} points` : '—'}
              </span>
            </div>

            <div className="pt-3 border-t border-purple-700">
              <div className="text-purple-300 text-sm mb-2">After Prestige:</div>
              <div className="text-yellow-300">
                +{currentBonus + 1}% to ALL production
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onPrestige}
        disabled={!canPrestige}
        className={`w-full py-4 rounded-lg transition-all text-xl flex items-center justify-center gap-3 ${
          canPrestige
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white shadow-lg shadow-yellow-500/50 cursor-pointer animate-pulse-glow'
            : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-50'
        }`}
      >
        <Sparkles className="w-6 h-6" />
        {canPrestige ? 'Prestige Now!' : `Need ${formatNumber(10000 - totalKnowledge)} more knowledge`}
      </button>

      <div className="mt-6 space-y-4">
        <div className="bg-indigo-950 bg-opacity-50 rounded-lg p-4 border border-indigo-700">
          <h4 className="text-white mb-2">What is Prestige?</h4>
          <p className="text-indigo-200 text-sm">
            Prestige resets your kingdom but grants you permanent bonuses that apply to all future runs. 
            Each prestige level gives you +1% to ALL resource production, making each subsequent playthrough faster!
          </p>
        </div>

        <div className="bg-pink-950 bg-opacity-50 rounded-lg p-4 border border-pink-700">
          <h4 className="text-white mb-2">What Carries Over?</h4>
          <div className="text-pink-200 text-sm space-y-1">
            <div>✅ Prestige Level & Points</div>
            <div>✅ Gems (rare resource)</div>
            <div>✅ Achievements</div>
            <div>❌ Skills (must unlock again)</div>
            <div>❌ Buildings (reset to level 0)</div>
            <div>❌ Heroes (must recruit again)</div>
            <div>❌ Resources (except gems)</div>
          </div>
        </div>

        <div className="bg-purple-950 bg-opacity-50 rounded-lg p-4 border border-purple-700">
          <h4 className="text-white mb-2">Tips for Prestige:</h4>
          <ul className="text-purple-200 text-sm space-y-1 list-disc list-inside">
            <li>First prestige unlocks at 10,000 lifetime knowledge</li>
            <li>The more knowledge you earn, the more prestige points you get</li>
            <li>Prestige bonuses stack additively (5 prestiges = +5%)</li>
            <li>Consider unlocking key skills before prestiging for faster progress</li>
            <li>Gems are valuable - they carry through prestige!</li>
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(234, 179, 8, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(234, 179, 8, 0.8);
          }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
