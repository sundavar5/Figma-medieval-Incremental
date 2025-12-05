import { Crown, RotateCcw, Sparkles } from 'lucide-react';

interface GameHeaderProps {
  currentAge: string;
  ageProgress: number;
  prestigeLevel: number;
  onReset: () => void;
}

export function GameHeader({ currentAge, ageProgress, prestigeLevel, onReset }: GameHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-purple-800 to-indigo-900 rounded-lg shadow-2xl p-6 border-2 border-purple-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Crown className="w-10 h-10 text-yellow-400" />
          <div>
            <h1 className="text-white text-3xl">Chronicles of the Realm</h1>
            <p className="text-purple-200 mt-1">Build your kingdom through the ages</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {prestigeLevel > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-900 bg-opacity-50 rounded-lg border border-yellow-600">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="text-yellow-400 text-sm">Prestige</div>
                <div className="text-white">Level {prestigeLevel}</div>
              </div>
            </div>
          )}
          
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-purple-200">Current Age:</span>
          <span className="text-yellow-400">{currentAge}</span>
        </div>
        <div className="w-full bg-purple-950 rounded-full h-3 border border-purple-600">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.min(ageProgress, 100)}%` }}
          />
        </div>
        <div className="text-right text-purple-300 text-sm mt-1">
          {ageProgress.toFixed(1)}% to next age
        </div>
      </div>
    </div>
  );
}