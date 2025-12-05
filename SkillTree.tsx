import { Lock, Check, Sparkles } from 'lucide-react';
import type { Skill } from '../App';
import { useState } from 'react';

interface SkillTreeProps {
  skills: Skill[];
  knowledge: number;
  onUnlock: (skillId: string) => void;
}

interface SkillNodeProps {
  skill: Skill;
  canUnlock: boolean;
  isLocked: boolean;
  knowledge: number;
  onClick: () => void;
  position: { x: number; y: number };
}

function SkillNode({ skill, canUnlock, isLocked, knowledge, onClick, position }: SkillNodeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div 
      className="absolute"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)'
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        onClick={() => canUnlock && onClick()}
        disabled={!canUnlock}
        className={`relative w-20 h-20 rounded-xl border-3 transition-all duration-200 ${
          skill.unlocked
            ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 shadow-lg shadow-green-500/50'
            : canUnlock
            ? 'bg-gradient-to-br from-yellow-500 to-orange-500 border-yellow-400 animate-pulse-glow cursor-pointer hover:scale-110 shadow-lg shadow-yellow-500/50'
            : isLocked
            ? 'bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600 opacity-40 cursor-not-allowed'
            : 'bg-gradient-to-br from-slate-600 to-slate-700 border-slate-500 opacity-60 cursor-not-allowed'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-3xl mb-1">{skill.icon}</div>
          {skill.unlocked && (
            <div className="absolute top-1 right-1 bg-green-400 rounded-full p-0.5">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
          {isLocked && !skill.unlocked && (
            <div className="absolute top-1 right-1 bg-slate-600 rounded-full p-0.5">
              <Lock className="w-3 h-3 text-slate-400" />
            </div>
          )}
          {canUnlock && !skill.unlocked && (
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
            </div>
          )}
        </div>
      </button>
      
      <div className="text-center mt-1 text-xs text-white drop-shadow-lg">
        {skill.name}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute left-1/2 -translate-x-1/2 top-24 z-50 w-64 bg-slate-900 border-2 border-slate-600 rounded-lg p-3 shadow-2xl">
          <div className="flex items-start gap-2 mb-2">
            <div className="text-2xl">{skill.icon}</div>
            <div>
              <h4 className="text-white">{skill.name}</h4>
              <div className="text-xs text-slate-400">Tier {skill.tier}</div>
            </div>
          </div>
          
          <p className="text-slate-300 text-sm mb-2">{skill.description}</p>
          
          <div className="border-t border-slate-700 pt-2 mb-2">
            <div className="text-green-400 text-sm">📈 {skill.effect}</div>
          </div>
          
          {!skill.unlocked && (
            <div className="border-t border-slate-700 pt-2">
              <div className={`text-sm mb-1 ${
                knowledge >= skill.cost.knowledge ? 'text-purple-300' : 'text-red-400'
              }`}>
                💎 Cost: {skill.cost.knowledge} Knowledge
              </div>
              {skill.prerequisites.length > 0 && (
                <div className="text-xs text-slate-400">
                  Requires: {skill.prerequisites.join(', ')}
                </div>
              )}
            </div>
          )}
          
          {skill.unlocked && (
            <div className="text-green-400 text-sm flex items-center gap-1">
              <Check className="w-4 h-4" /> Unlocked!
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(234, 179, 8, 0.5);
          }
          50% {
            box-shadow: 0 0 30px rgba(234, 179, 8, 0.8);
          }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function ConnectionLine({ from, to, unlocked }: { from: { x: number; y: number }, to: { x: number; y: number }, unlocked: boolean }) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI;
  const length = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));

  return (
    <div
      className="absolute origin-left transition-all duration-300"
      style={{
        left: `${from.x}px`,
        top: `${from.y}px`,
        width: `${length}px`,
        height: '3px',
        transform: `rotate(${angle}deg)`,
        background: unlocked 
          ? 'linear-gradient(90deg, #10b981, #34d399)' 
          : 'linear-gradient(90deg, #475569, #64748b)',
        boxShadow: unlocked ? '0 0 10px rgba(16, 185, 129, 0.5)' : 'none'
      }}
    />
  );
}

export function SkillTree({ skills, knowledge, onUnlock }: SkillTreeProps) {
  const canUnlock = (skill: Skill): boolean => {
    if (skill.unlocked) return false;
    if (knowledge < skill.cost.knowledge) return false;
    return skill.prerequisites.every(prereq => 
      skills.find(s => s.id === prereq)?.unlocked
    );
  };

  const isLocked = (skill: Skill): boolean => {
    if (skill.unlocked) return false;
    return !skill.prerequisites.every(prereq => 
      skills.find(s => s.id === prereq)?.unlocked
    );
  };

  // Define skill positions in a tree layout
  const skillPositions: { [key: string]: { x: number; y: number } } = {
    // Starting skills - Tier 1
    'farming': { x: 150, y: 100 },
    'woodcutting': { x: 300, y: 100 },
    'mining': { x: 450, y: 100 },
    'writing': { x: 600, y: 100 },
    'tools': { x: 750, y: 100 },
    'militia': { x: 900, y: 100 },
    'archery': { x: 1050, y: 100 },
    'mysticism': { x: 1200, y: 100 },

    // Tier 2
    'irrigation': { x: 150, y: 240 },
    'sawmill': { x: 300, y: 240 },
    'quarry': { x: 450, y: 240 },
    'library': { x: 600, y: 240 },
    'ironworking': { x: 825, y: 240 },
    'barracks': { x: 975, y: 240 },
    'cavalry': { x: 825, y: 380 },
    'alchemy': { x: 1125, y: 240 },
    'enchanting': { x: 1125, y: 380 },

    // Tier 3
    'academy': { x: 600, y: 380 },
    'castle': { x: 900, y: 520 },
    'wizardtower': { x: 1050, y: 520 },
  };

  // Create connections based on prerequisites
  const connections: Array<{ from: string; to: string }> = [];
  skills.forEach(skill => {
    skill.prerequisites.forEach(prereq => {
      connections.push({ from: prereq, to: skill.id });
    });
  });

  return (
    <div className="bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 rounded-lg shadow-2xl p-6 border-2 border-indigo-600 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white">Skill Tree</h2>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-green-500 to-emerald-600"></div>
            <span className="text-slate-300">Unlocked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-yellow-500 to-orange-500"></div>
            <span className="text-slate-300">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-slate-700 to-slate-800 opacity-40"></div>
            <span className="text-slate-300">Locked</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 bg-opacity-50 rounded-lg p-4 border border-slate-700 overflow-x-auto">
        <div className="relative" style={{ minWidth: '1350px', height: '620px' }}>
          {/* Draw connection lines */}
          {connections.map((conn, idx) => {
            const fromPos = skillPositions[conn.from];
            const toPos = skillPositions[conn.to];
            const fromSkill = skills.find(s => s.id === conn.from);
            
            if (!fromPos || !toPos) return null;

            return (
              <ConnectionLine
                key={idx}
                from={fromPos}
                to={toPos}
                unlocked={fromSkill?.unlocked || false}
              />
            );
          })}

          {/* Draw skill nodes */}
          {skills.map(skill => {
            const position = skillPositions[skill.id];
            if (!position) return null;

            return (
              <SkillNode
                key={skill.id}
                skill={skill}
                canUnlock={canUnlock(skill)}
                isLocked={isLocked(skill)}
                knowledge={knowledge}
                onClick={() => onUnlock(skill.id)}
                position={position}
              />
            );
          })}

          {/* Category labels */}
          <div className="absolute top-0 left-200 bg-green-900 bg-opacity-80 px-3 py-1 rounded-lg border border-green-600">
            <span className="text-green-200 text-sm">💰 Economy</span>
          </div>
          <div className="absolute top-0 left-650 bg-blue-900 bg-opacity-80 px-3 py-1 rounded-lg border border-blue-600">
            <span className="text-blue-200 text-sm">⚙️ Technology</span>
          </div>
          <div className="absolute top-0 left-950 bg-red-900 bg-opacity-80 px-3 py-1 rounded-lg border border-red-600">
            <span className="text-red-200 text-sm">⚔️ Military</span>
          </div>
          <div className="absolute top-0 left-1150 bg-purple-900 bg-opacity-80 px-3 py-1 rounded-lg border border-purple-600">
            <span className="text-purple-200 text-sm">✨ Magic</span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="p-3 bg-indigo-950 bg-opacity-50 rounded-lg border border-indigo-700">
          <p className="text-indigo-200 text-sm">
            💡 Hover over skills to see details
          </p>
        </div>
        <div className="p-3 bg-purple-950 bg-opacity-50 rounded-lg border border-purple-700">
          <p className="text-purple-200 text-sm">
            ⚡ Skills with sparkles are ready to unlock!
          </p>
        </div>
      </div>
    </div>
  );
}
