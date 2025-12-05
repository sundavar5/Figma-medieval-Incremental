import { Trophy, Check } from 'lucide-react';
import type { Achievement } from '../App';

interface AchievementsProps {
  achievements: Achievement[];
}

export function Achievements({ achievements }: AchievementsProps) {
  const categories = [
    { id: 'progress', name: 'Progress', color: 'from-blue-600 to-cyan-700' },
    { id: 'milestone', name: 'Milestones', color: 'from-green-600 to-emerald-700' },
    { id: 'building', name: 'Building', color: 'from-amber-600 to-orange-700' },
    { id: 'hero', name: 'Heroes', color: 'from-purple-600 to-violet-700' },
    { id: 'age', name: 'Ages', color: 'from-yellow-600 to-yellow-700' }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="bg-gradient-to-br from-purple-900 to-indigo-950 rounded-lg shadow-2xl p-6 border-2 border-purple-600">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-400" />
          <h2 className="text-white">Achievements</h2>
        </div>
        <div className="text-yellow-400">
          {unlockedCount} / {totalCount}
        </div>
      </div>

      {categories.map(category => {
        const categoryAchievements = achievements.filter(a => a.category === category.id);
        if (categoryAchievements.length === 0) return null;

        return (
          <div key={category.id} className="mb-6">
            <div className={`bg-gradient-to-r ${category.color} rounded-lg p-3 mb-3`}>
              <h3 className="text-white">{category.name}</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {categoryAchievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`rounded-lg p-4 border-2 transition-all relative ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-yellow-600 to-orange-600 border-yellow-400 shadow-lg shadow-yellow-500/30'
                      : 'bg-slate-800 border-slate-600 opacity-50'
                  }`}
                  title={`${achievement.description}\nReward: ${achievement.reward}`}
                >
                  {achievement.unlocked && (
                    <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  
                  <div className="text-4xl text-center mb-2">{achievement.icon}</div>
                  <div className={`text-center text-sm mb-2 ${achievement.unlocked ? 'text-white' : 'text-slate-400'}`}>
                    {achievement.name}
                  </div>
                  <div className={`text-xs text-center ${achievement.unlocked ? 'text-yellow-100' : 'text-slate-500'}`}>
                    {achievement.description}
                  </div>
                  
                  {achievement.unlocked && (
                    <div className="mt-2 pt-2 border-t border-yellow-500">
                      <div className="text-xs text-center text-green-200">
                        {achievement.reward}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="mt-4 p-4 bg-purple-950 bg-opacity-50 rounded-lg border border-purple-700">
        <p className="text-purple-200 text-sm">
          🏆 Achievements grant permanent bonuses! Hover over them to see rewards.
        </p>
      </div>
    </div>
  );
}
