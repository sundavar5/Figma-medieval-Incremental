import { useState, useEffect } from 'react';
import { GameHeader } from './components/GameHeader';
import { StoryPanel } from './components/StoryPanel';
import { SkillTree } from './components/SkillTree';
import { ResourcePanel } from './components/ResourcePanel';
import { EventLog } from './components/EventLog';
import { Buildings } from './components/Buildings';
import { Heroes } from './components/Heroes';
import { Achievements } from './components/Achievements';
import { PrestigePanel } from './components/PrestigePanel';

export interface Resources {
  population: number;
  food: number;
  wood: number;
  stone: number;
  iron: number;
  gold: number;
  mana: number;
  knowledge: number;
  faith: number;
  gems: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: 'military' | 'economy' | 'magic' | 'technology' | 'divine' | 'arcane';
  tier: number;
  unlocked: boolean;
  prerequisites: string[];
  cost: { knowledge: number };
  effect: string;
  icon: string;
}

export interface Building {
  id: string;
  name: string;
  description: string;
  level: number;
  baseCost: { [key: string]: number };
  production: { [key: string]: number };
  icon: string;
  category: string;
}

export interface Hero {
  id: string;
  name: string;
  description: string;
  level: number;
  unlocked: boolean;
  cost: { [key: string]: number };
  bonus: string;
  icon: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  reward: string;
  icon: string;
  category: string;
}

export interface StoryEvent {
  id: string;
  title: string;
  description: string;
  timestamp: number;
}

export interface GameState {
  currentAge: number;
  ageProgress: number;
  resources: Resources;
  production: Resources;
  skills: Skill[];
  buildings: Building[];
  heroes: Hero[];
  achievements: Achievement[];
  events: StoryEvent[];
  prestigeLevel: number;
  prestigePoints: number;
  totalKnowledgeEarned: number;
  totalGoldEarned: number;
  lifetimeProduction: Resources;
}

const AGES = [
  { name: 'Dark Age', description: 'Your village struggles to survive in a harsh world...', requirement: 0 },
  { name: 'Age of Growth', description: 'Your settlement begins to flourish...', requirement: 1000 },
  { name: 'Age of Discovery', description: 'Knowledge spreads throughout your land...', requirement: 10000 },
  { name: 'Age of Might', description: 'Your kingdom becomes a force to be reckoned with...', requirement: 100000 },
  { name: 'Age of Magic', description: 'Arcane powers awaken across the realm...', requirement: 500000 },
  { name: 'Age of Legends', description: 'Your empire reaches unprecedented greatness...', requirement: 2000000 },
  { name: 'Transcendent Age', description: 'You have surpassed mortal limitations...', requirement: 10000000 }
];

function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentAge: 0,
    ageProgress: 0,
    resources: {
      population: 10,
      food: 100,
      wood: 50,
      stone: 30,
      iron: 0,
      gold: 0,
      mana: 0,
      knowledge: 0,
      faith: 0,
      gems: 0
    },
    production: {
      population: 0.05,
      food: 0.5,
      wood: 0.3,
      stone: 0.2,
      iron: 0,
      gold: 0,
      mana: 0,
      knowledge: 0.1,
      faith: 0,
      gems: 0
    },
    skills: [],
    buildings: [],
    heroes: [],
    achievements: [],
    events: [],
    prestigeLevel: 0,
    prestigePoints: 0,
    totalKnowledgeEarned: 0,
    totalGoldEarned: 0,
    lifetimeProduction: {
      population: 0, food: 0, wood: 0, stone: 0, iron: 0,
      gold: 0, mana: 0, knowledge: 0, faith: 0, gems: 0
    }
  });

  const [activeTab, setActiveTab] = useState<'skills' | 'buildings' | 'heroes' | 'achievements' | 'prestige'>('skills');

  // Initialize game data
  useEffect(() => {
    initializeSkills();
    initializeBuildings();
    initializeHeroes();
    initializeAchievements();
  }, []);

  const initializeSkills = () => {
    const skills: Skill[] = [
      // TIER 1 - Basic Economy (Cost: 5-15)
      { id: 'farming1', name: 'Farming I', description: 'Basic agricultural techniques', category: 'economy', tier: 1, unlocked: false, prerequisites: [], cost: { knowledge: 5 }, effect: '+0.5 food/s', icon: '🌾' },
      { id: 'woodcutting1', name: 'Woodcutting I', description: 'Organize lumber operations', category: 'economy', tier: 1, unlocked: false, prerequisites: [], cost: { knowledge: 5 }, effect: '+0.3 wood/s', icon: '🪓' },
      { id: 'mining1', name: 'Mining I', description: 'Extract stone from quarries', category: 'economy', tier: 1, unlocked: false, prerequisites: [], cost: { knowledge: 8 }, effect: '+0.2 stone/s', icon: '⛏️' },
      { id: 'gathering', name: 'Gathering', description: 'Efficient resource collection', category: 'economy', tier: 1, unlocked: false, prerequisites: [], cost: { knowledge: 10 }, effect: '+10% all basic resources', icon: '🧺' },
      
      // TIER 1 - Basic Tech (Cost: 10-20)
      { id: 'writing', name: 'Writing', description: 'Record knowledge', category: 'technology', tier: 1, unlocked: false, prerequisites: [], cost: { knowledge: 10 }, effect: '+0.3 knowledge/s', icon: '📜' },
      { id: 'tools1', name: 'Tools I', description: 'Better tools', category: 'technology', tier: 1, unlocked: false, prerequisites: [], cost: { knowledge: 12 }, effect: '+10% all production', icon: '🔧' },
      { id: 'housing', name: 'Housing', description: 'Better living conditions', category: 'technology', tier: 1, unlocked: false, prerequisites: [], cost: { knowledge: 15 }, effect: '+0.1 population/s', icon: '🏠' },
      
      // TIER 1 - Basic Military (Cost: 8-18)
      { id: 'militia', name: 'Militia', description: 'Citizen soldiers', category: 'military', tier: 1, unlocked: false, prerequisites: [], cost: { knowledge: 8 }, effect: 'Unlock military buildings', icon: '🛡️' },
      { id: 'archery', name: 'Archery', description: 'Bow and arrow', category: 'military', tier: 1, unlocked: false, prerequisites: [], cost: { knowledge: 10 }, effect: '+0.2 food/s (hunting)', icon: '🏹' },
      { id: 'tactics', name: 'Tactics', description: 'Basic battle strategy', category: 'military', tier: 1, unlocked: false, prerequisites: ['militia'], cost: { knowledge: 18 }, effect: '+15% military efficiency', icon: '📋' },
      
      // TIER 2 - Advanced Economy (Cost: 20-50)
      { id: 'farming2', name: 'Farming II', description: 'Advanced farming', category: 'economy', tier: 2, unlocked: false, prerequisites: ['farming1'], cost: { knowledge: 25 }, effect: '+1.5 food/s', icon: '🌾' },
      { id: 'irrigation', name: 'Irrigation', description: 'Water channels', category: 'economy', tier: 2, unlocked: false, prerequisites: ['farming1'], cost: { knowledge: 30 }, effect: '+2.0 food/s, +0.2 population/s', icon: '💧' },
      { id: 'woodcutting2', name: 'Woodcutting II', description: 'Advanced logging', category: 'economy', tier: 2, unlocked: false, prerequisites: ['woodcutting1'], cost: { knowledge: 25 }, effect: '+1.0 wood/s', icon: '🪓' },
      { id: 'sawmill', name: 'Sawmill', description: 'Process lumber efficiently', category: 'economy', tier: 2, unlocked: false, prerequisites: ['woodcutting1'], cost: { knowledge: 35 }, effect: '+1.5 wood/s', icon: '🏭' },
      { id: 'mining2', name: 'Mining II', description: 'Deep mining', category: 'economy', tier: 2, unlocked: false, prerequisites: ['mining1'], cost: { knowledge: 30 }, effect: '+0.8 stone/s', icon: '⛏️' },
      { id: 'quarry', name: 'Quarry', description: 'Large stone operations', category: 'economy', tier: 2, unlocked: false, prerequisites: ['mining1'], cost: { knowledge: 40 }, effect: '+1.2 stone/s', icon: '🗿' },
      { id: 'commerce', name: 'Commerce', description: 'Establish trade', category: 'economy', tier: 2, unlocked: false, prerequisites: ['gathering'], cost: { knowledge: 45 }, effect: 'Unlock gold: +0.1 gold/s', icon: '💰' },
      
      // TIER 2 - Advanced Tech (Cost: 30-80)
      { id: 'mathematics', name: 'Mathematics', description: 'Numbers and calculation', category: 'technology', tier: 2, unlocked: false, prerequisites: ['writing'], cost: { knowledge: 35 }, effect: '+0.5 knowledge/s', icon: '🔢' },
      { id: 'library', name: 'Library', description: 'Store wisdom', category: 'technology', tier: 2, unlocked: false, prerequisites: ['writing'], cost: { knowledge: 50 }, effect: '+1.0 knowledge/s', icon: '📚' },
      { id: 'tools2', name: 'Tools II', description: 'Advanced tools', category: 'technology', tier: 2, unlocked: false, prerequisites: ['tools1'], cost: { knowledge: 40 }, effect: '+15% all production', icon: '🔧' },
      { id: 'ironworking', name: 'Ironworking', description: 'Work with iron', category: 'technology', tier: 2, unlocked: false, prerequisites: ['mining1', 'tools1'], cost: { knowledge: 60 }, effect: 'Unlock iron: +0.1 iron/s', icon: '⚒️' },
      { id: 'engineering', name: 'Engineering', description: 'Build better structures', category: 'technology', tier: 2, unlocked: false, prerequisites: ['mathematics'], cost: { knowledge: 70 }, effect: '+20% building efficiency', icon: '⚙️' },
      
      // TIER 2 - Advanced Military (Cost: 25-70)
      { id: 'barracks', name: 'Barracks', description: 'Train soldiers', category: 'military', tier: 2, unlocked: false, prerequisites: ['militia'], cost: { knowledge: 40 }, effect: 'Better military training', icon: '⚔️' },
      { id: 'cavalry', name: 'Cavalry', description: 'Mounted warriors', category: 'military', tier: 2, unlocked: false, prerequisites: ['barracks', 'farming1'], cost: { knowledge: 55 }, effect: '+0.5 food/s (raids)', icon: '🐎' },
      { id: 'fortifications', name: 'Fortifications', description: 'Defensive structures', category: 'military', tier: 2, unlocked: false, prerequisites: ['tactics', 'quarry'], cost: { knowledge: 65 }, effect: '+25% defense', icon: '🏰' },
      
      // TIER 1 - Basic Magic (Cost: 15-30)
      { id: 'mysticism', name: 'Mysticism', description: 'Study the arcane', category: 'magic', tier: 1, unlocked: false, prerequisites: [], cost: { knowledge: 20 }, effect: '+0.2 knowledge/s', icon: '✨' },
      { id: 'meditation', name: 'Meditation', description: 'Focus the mind', category: 'magic', tier: 1, unlocked: false, prerequisites: [], cost: { knowledge: 25 }, effect: 'Unlock mana: +0.1 mana/s', icon: '🧘' },
      
      // TIER 3 - Master Economy (Cost: 80-200)
      { id: 'farming3', name: 'Farming III', description: 'Master farming', category: 'economy', tier: 3, unlocked: false, prerequisites: ['farming2', 'irrigation'], cost: { knowledge: 100 }, effect: '+3.0 food/s', icon: '🌾' },
      { id: 'plantation', name: 'Plantation', description: 'Large-scale agriculture', category: 'economy', tier: 3, unlocked: false, prerequisites: ['irrigation'], cost: { knowledge: 120 }, effect: '+4.0 food/s, +0.5 population/s', icon: '🌿' },
      { id: 'woodcutting3', name: 'Woodcutting III', description: 'Master logging', category: 'economy', tier: 3, unlocked: false, prerequisites: ['woodcutting2', 'sawmill'], cost: { knowledge: 100 }, effect: '+2.5 wood/s', icon: '🪓' },
      { id: 'lumbermill', name: 'Lumber Mill', description: 'Industrial lumber', category: 'economy', tier: 3, unlocked: false, prerequisites: ['sawmill', 'engineering'], cost: { knowledge: 140 }, effect: '+3.5 wood/s', icon: '🏗️' },
      { id: 'mining3', name: 'Mining III', description: 'Master mining', category: 'economy', tier: 3, unlocked: false, prerequisites: ['mining2', 'quarry'], cost: { knowledge: 110 }, effect: '+2.0 stone/s', icon: '⛏️' },
      { id: 'deepmine', name: 'Deep Mine', description: 'Extract rare minerals', category: 'economy', tier: 3, unlocked: false, prerequisites: ['quarry', 'ironworking'], cost: { knowledge: 150 }, effect: '+3.0 stone/s, +0.5 iron/s', icon: '🕳️' },
      { id: 'banking', name: 'Banking', description: 'Manage wealth', category: 'economy', tier: 3, unlocked: false, prerequisites: ['commerce'], cost: { knowledge: 130 }, effect: '+0.5 gold/s', icon: '🏦' },
      { id: 'trade', name: 'Trade Routes', description: 'International trade', category: 'economy', tier: 3, unlocked: false, prerequisites: ['commerce'], cost: { knowledge: 160 }, effect: '+1.0 gold/s, +20% all resources', icon: '🚢' },
      
      // TIER 3 - Master Tech (Cost: 100-250)
      { id: 'academy', name: 'Academy', description: 'Institution of learning', category: 'technology', tier: 3, unlocked: false, prerequisites: ['library', 'mathematics'], cost: { knowledge: 120 }, effect: '+2.0 knowledge/s', icon: '🎓' },
      { id: 'philosophy', name: 'Philosophy', description: 'Study existence', category: 'technology', tier: 3, unlocked: false, prerequisites: ['library'], cost: { knowledge: 140 }, effect: '+2.5 knowledge/s', icon: '🤔' },
      { id: 'tools3', name: 'Tools III', description: 'Master tools', category: 'technology', tier: 3, unlocked: false, prerequisites: ['tools2', 'ironworking'], cost: { knowledge: 110 }, effect: '+25% all production', icon: '🔧' },
      { id: 'metallurgy', name: 'Metallurgy', description: 'Advanced metalwork', category: 'technology', tier: 3, unlocked: false, prerequisites: ['ironworking'], cost: { knowledge: 150 }, effect: '+0.8 iron/s', icon: '🔥' },
      { id: 'architecture', name: 'Architecture', description: 'Grand structures', category: 'technology', tier: 3, unlocked: false, prerequisites: ['engineering'], cost: { knowledge: 180 }, effect: '+30% building power', icon: '🏛️' },
      { id: 'astronomy', name: 'Astronomy', description: 'Study the stars', category: 'technology', tier: 3, unlocked: false, prerequisites: ['mathematics', 'philosophy'], cost: { knowledge: 200 }, effect: '+3.0 knowledge/s', icon: '🔭' },
      
      // TIER 3 - Master Military (Cost: 90-220)
      { id: 'castle', name: 'Castle', description: 'Mighty fortress', category: 'military', tier: 3, unlocked: false, prerequisites: ['fortifications', 'architecture'], cost: { knowledge: 200 }, effect: '+2.0 all resources/s', icon: '🏰' },
      { id: 'knighthood', name: 'Knighthood', description: 'Elite warriors', category: 'military', tier: 3, unlocked: false, prerequisites: ['cavalry', 'barracks'], cost: { knowledge: 170 }, effect: '+1.5 gold/s (conquest)', icon: '🛡️' },
      { id: 'siegecraft', name: 'Siege Craft', description: 'Siege weapons', category: 'military', tier: 3, unlocked: false, prerequisites: ['engineering', 'barracks'], cost: { knowledge: 190 }, effect: '+40% military power', icon: '🎯' },
      
      // TIER 2-3 - Magic Development (Cost: 50-180)
      { id: 'alchemy', name: 'Alchemy', description: 'Transform materials', category: 'magic', tier: 2, unlocked: false, prerequisites: ['mysticism'], cost: { knowledge: 70 }, effect: '+0.8 all resources/s', icon: '🧪' },
      { id: 'enchanting', name: 'Enchanting', description: 'Magical enhancement', category: 'magic', tier: 2, unlocked: false, prerequisites: ['mysticism', 'ironworking'], cost: { knowledge: 90 }, effect: '+30% all production', icon: '🔮' },
      { id: 'spellcraft', name: 'Spellcraft', description: 'Master spells', category: 'magic', tier: 3, unlocked: false, prerequisites: ['alchemy', 'meditation'], cost: { knowledge: 150 }, effect: '+1.0 mana/s', icon: '📖' },
      { id: 'wizardtower', name: 'Wizard Tower', description: 'Arcane nexus', category: 'magic', tier: 3, unlocked: false, prerequisites: ['spellcraft', 'library'], cost: { knowledge: 180 }, effect: '+2.0 mana/s, +2.0 knowledge/s', icon: '🗼' },
      
      // TIER 4 - Legendary Economy (Cost: 250-600)
      { id: 'farming4', name: 'Farming IV', description: 'Legendary farming', category: 'economy', tier: 4, unlocked: false, prerequisites: ['farming3', 'plantation'], cost: { knowledge: 300 }, effect: '+6.0 food/s', icon: '🌾' },
      { id: 'granary', name: 'Grand Granary', description: 'Massive food storage', category: 'economy', tier: 4, unlocked: false, prerequisites: ['plantation'], cost: { knowledge: 350 }, effect: '+8.0 food/s, +1.0 population/s', icon: '🏛️' },
      { id: 'goldmine', name: 'Gold Mine', description: 'Extract precious metals', category: 'economy', tier: 4, unlocked: false, prerequisites: ['deepmine', 'banking'], cost: { knowledge: 400 }, effect: '+2.0 gold/s, +1.0 iron/s', icon: '💎' },
      { id: 'marketplace', name: 'Grand Marketplace', description: 'Hub of commerce', category: 'economy', tier: 4, unlocked: false, prerequisites: ['trade', 'banking'], cost: { knowledge: 450 }, effect: '+3.0 gold/s, +30% economy', icon: '🏪' },
      
      // TIER 4 - Legendary Tech (Cost: 300-700)
      { id: 'university', name: 'University', description: 'Peak of learning', category: 'technology', tier: 4, unlocked: false, prerequisites: ['academy', 'philosophy'], cost: { knowledge: 350 }, effect: '+5.0 knowledge/s', icon: '🏫' },
      { id: 'science', name: 'Scientific Method', description: 'Systematic study', category: 'technology', tier: 4, unlocked: false, prerequisites: ['astronomy', 'academy'], cost: { knowledge: 450 }, effect: '+6.0 knowledge/s, +50% tech', icon: '🔬' },
      { id: 'masterwork', name: 'Masterwork Crafting', description: 'Perfect creations', category: 'technology', tier: 4, unlocked: false, prerequisites: ['tools3', 'metallurgy'], cost: { knowledge: 380 }, effect: '+40% all production', icon: '⚒️' },
      
      // TIER 4 - Legendary Military (Cost: 280-650)
      { id: 'fortress', name: 'Grand Fortress', description: 'Impregnable defense', category: 'military', tier: 4, unlocked: false, prerequisites: ['castle'], cost: { knowledge: 400 }, effect: '+3.0 all resources/s, +50% defense', icon: '🏰' },
      { id: 'champion', name: 'Champions', description: 'Legendary warriors', category: 'military', tier: 4, unlocked: false, prerequisites: ['knighthood'], cost: { knowledge: 500 }, effect: '+4.0 gold/s, unlock heroes', icon: '👑' },
      
      // TIER 4 - Legendary Magic (Cost: 250-800)
      { id: 'archmage', name: 'Archmage Studies', description: 'Ultimate magic', category: 'magic', tier: 4, unlocked: false, prerequisites: ['wizardtower', 'enchanting'], cost: { knowledge: 450 }, effect: '+3.0 mana/s, +50% magic', icon: '🧙' },
      { id: 'ritual', name: 'Ritual Magic', description: 'Powerful ceremonies', category: 'magic', tier: 4, unlocked: false, prerequisites: ['spellcraft', 'alchemy'], cost: { knowledge: 380 }, effect: '+2.5 mana/s, +2.0 all resources/s', icon: '🕯️' },
      { id: 'sorcery', name: 'Grand Sorcery', description: 'Reality-bending magic', category: 'magic', tier: 4, unlocked: false, prerequisites: ['archmage', 'ritual'], cost: { knowledge: 600 }, effect: '+5.0 mana/s, +60% all production', icon: '⚡' },
      
      // TIER 1 - Divine Path (Cost: 30-50)
      { id: 'religion', name: 'Religion', description: 'Worship the divine', category: 'divine', tier: 1, unlocked: false, prerequisites: [], cost: { knowledge: 35 }, effect: 'Unlock faith: +0.1 faith/s', icon: '⛪' },
      
      // TIER 2-3 Divine (Cost: 60-200)
      { id: 'temple', name: 'Temple', description: 'House of worship', category: 'divine', tier: 2, unlocked: false, prerequisites: ['religion'], cost: { knowledge: 80 }, effect: '+0.5 faith/s', icon: '🛕' },
      { id: 'clergy', name: 'Clergy', description: 'Religious leaders', category: 'divine', tier: 2, unlocked: false, prerequisites: ['religion'], cost: { knowledge: 95 }, effect: '+0.8 faith/s, +0.5 knowledge/s', icon: '👼' },
      { id: 'cathedral', name: 'Cathedral', description: 'Grand temple', category: 'divine', tier: 3, unlocked: false, prerequisites: ['temple', 'architecture'], cost: { knowledge: 220 }, effect: '+2.0 faith/s', icon: '⛪' },
      { id: 'miracle', name: 'Miracles', description: 'Divine intervention', category: 'divine', tier: 3, unlocked: false, prerequisites: ['clergy'], cost: { knowledge: 250 }, effect: '+3.0 faith/s, +1.5 all resources/s', icon: '✝️' },
      
      // TIER 4-5 Divine (Cost: 300-1000)
      { id: 'holycity', name: 'Holy City', description: 'Pilgrimage destination', category: 'divine', tier: 4, unlocked: false, prerequisites: ['cathedral', 'miracle'], cost: { knowledge: 550 }, effect: '+5.0 faith/s, +3.0 gold/s', icon: '🌟' },
      { id: 'ascension', name: 'Divine Ascension', description: 'Transcend mortality', category: 'divine', tier: 5, unlocked: false, prerequisites: ['holycity'], cost: { knowledge: 1000 }, effect: '+10.0 all resources/s, unlock prestige', icon: '👑' },
      
      // TIER 5 - Arcane Path (Cost: 700-2000)
      { id: 'arcanelibrary', name: 'Arcane Library', description: 'Forbidden knowledge', category: 'arcane', tier: 5, unlocked: false, prerequisites: ['university', 'archmage'], cost: { knowledge: 800 }, effect: '+8.0 knowledge/s, +4.0 mana/s', icon: '📚' },
      { id: 'timemage', name: 'Time Magic', description: 'Manipulate time', category: 'arcane', tier: 5, unlocked: false, prerequisites: ['sorcery'], cost: { knowledge: 1200 }, effect: '+100% all production', icon: '⏰' },
      { id: 'worldgate', name: 'World Gate', description: 'Portal to other realms', category: 'arcane', tier: 5, unlocked: false, prerequisites: ['arcanelibrary', 'timemage'], cost: { knowledge: 1500 }, effect: 'Unlock gems: +0.5 gems/s, +5.0 all/s', icon: '🌀' },
      { id: 'omniscience', name: 'Omniscience', description: 'Know all things', category: 'arcane', tier: 5, unlocked: false, prerequisites: ['worldgate', 'ascension'], cost: { knowledge: 2000 }, effect: '+15.0 knowledge/s, +10.0 all/s, +150% all', icon: '🌌' }
    ];

    setGameState(prev => ({ ...prev, skills }));
  };

  const initializeBuildings = () => {
    const buildings: Building[] = [
      { id: 'farm', name: 'Farm', description: 'Produces food', level: 0, baseCost: { wood: 10, stone: 5 }, production: { food: 0.5 }, icon: '🚜', category: 'economy' },
      { id: 'lumbercamp', name: 'Lumber Camp', description: 'Produces wood', level: 0, baseCost: { food: 15, stone: 8 }, production: { wood: 0.4 }, icon: '🌲', category: 'economy' },
      { id: 'stonepit', name: 'Stone Pit', description: 'Produces stone', level: 0, baseCost: { wood: 20, food: 10 }, production: { stone: 0.3 }, icon: '🪨', category: 'economy' },
      { id: 'ironmine', name: 'Iron Mine', description: 'Produces iron', level: 0, baseCost: { wood: 50, stone: 40, food: 30 }, production: { iron: 0.2 }, icon: '⛏️', category: 'economy' },
      { id: 'goldmine', name: 'Gold Mine', description: 'Produces gold', level: 0, baseCost: { wood: 100, stone: 80, iron: 20 }, production: { gold: 0.15 }, icon: '💰', category: 'economy' },
      { id: 'house', name: 'House', description: 'Increases population', level: 0, baseCost: { wood: 30, stone: 20 }, production: { population: 0.1 }, icon: '🏘️', category: 'economy' },
      { id: 'school', name: 'School', description: 'Produces knowledge', level: 0, baseCost: { wood: 40, stone: 30, gold: 10 }, production: { knowledge: 0.3 }, icon: '🏫', category: 'technology' },
      { id: 'shrine', name: 'Shrine', description: 'Produces faith', level: 0, baseCost: { stone: 60, wood: 40, gold: 20 }, production: { faith: 0.2 }, icon: '⛩️', category: 'divine' },
      { id: 'manatower', name: 'Mana Tower', description: 'Produces mana', level: 0, baseCost: { stone: 80, iron: 30, gold: 40 }, production: { mana: 0.25 }, icon: '🗼', category: 'magic' },
      { id: 'workshop', name: 'Workshop', description: 'Boosts production', level: 0, baseCost: { wood: 70, iron: 40, stone: 50 }, production: {}, icon: '🔨', category: 'technology' },
      { id: 'barracksbuilding', name: 'Barracks', description: 'Military training', level: 0, baseCost: { wood: 60, stone: 70, iron: 30 }, production: { gold: 0.3 }, icon: '⚔️', category: 'military' }
    ];

    setGameState(prev => ({ ...prev, buildings }));
  };

  const initializeHeroes = () => {
    const heroes: Hero[] = [
      { id: 'farmer', name: 'Master Farmer', description: 'Farming expert', level: 0, unlocked: false, cost: { gold: 100, food: 200 }, bonus: '+50% food production', icon: '👨‍🌾' },
      { id: 'lumberjack', name: 'Master Lumberjack', description: 'Logging expert', level: 0, unlocked: false, cost: { gold: 100, wood: 200 }, bonus: '+50% wood production', icon: '🪓' },
      { id: 'miner', name: 'Master Miner', description: 'Mining expert', level: 0, unlocked: false, cost: { gold: 150, stone: 200 }, bonus: '+50% stone/iron production', icon: '⛏️' },
      { id: 'merchant', name: 'Grand Merchant', description: 'Trade master', level: 0, unlocked: false, cost: { gold: 500, knowledge: 100 }, bonus: '+100% gold production', icon: '🤵' },
      { id: 'scholar', name: 'Grand Scholar', description: 'Knowledge seeker', level: 0, unlocked: false, cost: { gold: 300, knowledge: 200 }, bonus: '+75% knowledge production', icon: '👨‍🎓' },
      { id: 'priest', name: 'High Priest', description: 'Divine conduit', level: 0, unlocked: false, cost: { gold: 400, faith: 100 }, bonus: '+100% faith production', icon: '🧙‍♂️' },
      { id: 'wizard', name: 'Archmage', description: 'Magic master', level: 0, unlocked: false, cost: { gold: 600, mana: 150 }, bonus: '+100% mana production', icon: '🧙' },
      { id: 'general', name: 'Grand General', description: 'Military genius', level: 0, unlocked: false, cost: { gold: 800, iron: 200 }, bonus: '+50% all military bonuses', icon: '⚔️' },
      { id: 'king', name: 'Divine King', description: 'Legendary ruler', level: 0, unlocked: false, cost: { gold: 2000, knowledge: 500, faith: 300 }, bonus: '+25% ALL production', icon: '👑' }
    ];

    setGameState(prev => ({ ...prev, heroes }));
  };

  const initializeAchievements = () => {
    const achievements: Achievement[] = [
      { id: 'first_skill', name: 'First Step', description: 'Unlock your first skill', unlocked: false, reward: '+5% knowledge gain', icon: '🎯', category: 'progress' },
      { id: 'skill_10', name: 'Scholar', description: 'Unlock 10 skills', unlocked: false, reward: '+10% knowledge gain', icon: '📚', category: 'progress' },
      { id: 'skill_25', name: 'Sage', description: 'Unlock 25 skills', unlocked: false, reward: '+15% knowledge gain', icon: '🎓', category: 'progress' },
      { id: 'skill_50', name: 'Master', description: 'Unlock 50 skills', unlocked: false, reward: '+25% knowledge gain', icon: '🌟', category: 'progress' },
      { id: 'skill_all', name: 'Omniscient', description: 'Unlock all skills', unlocked: false, reward: '+50% all production', icon: '🌌', category: 'progress' },
      
      { id: 'knowledge_100', name: 'Learner', description: 'Reach 100 knowledge', unlocked: false, reward: '+0.5 knowledge/s', icon: '📖', category: 'milestone' },
      { id: 'knowledge_1000', name: 'Academic', description: 'Reach 1,000 knowledge', unlocked: false, reward: '+2.0 knowledge/s', icon: '🏫', category: 'milestone' },
      { id: 'knowledge_10000', name: 'Genius', description: 'Reach 10,000 knowledge', unlocked: false, reward: '+5.0 knowledge/s', icon: '🧠', category: 'milestone' },
      
      { id: 'gold_100', name: 'Wealthy', description: 'Reach 100 gold', unlocked: false, reward: '+0.5 gold/s', icon: '💰', category: 'milestone' },
      { id: 'gold_1000', name: 'Rich', description: 'Reach 1,000 gold', unlocked: false, reward: '+2.0 gold/s', icon: '💎', category: 'milestone' },
      
      { id: 'pop_100', name: 'Village', description: 'Reach 100 population', unlocked: false, reward: '+10% all production', icon: '🏘️', category: 'milestone' },
      { id: 'pop_1000', name: 'Town', description: 'Reach 1,000 population', unlocked: false, reward: '+20% all production', icon: '🏙️', category: 'milestone' },
      
      { id: 'building_10', name: 'Builder', description: 'Build 10 total building levels', unlocked: false, reward: '+10% building efficiency', icon: '🏗️', category: 'building' },
      { id: 'building_50', name: 'Architect', description: 'Build 50 total building levels', unlocked: false, reward: '+25% building efficiency', icon: '🏛️', category: 'building' },
      
      { id: 'hero_1', name: 'Recruiter', description: 'Unlock your first hero', unlocked: false, reward: '+5% hero effectiveness', icon: '🦸', category: 'hero' },
      { id: 'hero_5', name: 'Leader', description: 'Unlock 5 heroes', unlocked: false, reward: '+15% hero effectiveness', icon: '👑', category: 'hero' },
      
      { id: 'age_2', name: 'Growing Kingdom', description: 'Reach Age of Growth', unlocked: false, reward: '+10% all resources', icon: '🌱', category: 'age' },
      { id: 'age_4', name: 'Mighty Kingdom', description: 'Reach Age of Might', unlocked: false, reward: '+25% all resources', icon: '⚔️', category: 'age' },
      { id: 'age_6', name: 'Legendary Kingdom', description: 'Reach Age of Legends', unlocked: false, reward: '+50% all resources', icon: '👑', category: 'age' }
    ];

    setGameState(prev => ({ ...prev, achievements }));
  };

  // Load game
  useEffect(() => {
    const saved = localStorage.getItem('medievalKingdomExtreme');
    if (saved) {
      const loaded = JSON.parse(saved);
      setGameState(loaded);
    }
  }, []);

  // Save game
  useEffect(() => {
    const saveInterval = setInterval(() => {
      localStorage.setItem('medievalKingdomExtreme', JSON.stringify(gameState));
    }, 5000);

    return () => clearInterval(saveInterval);
  }, [gameState]);

  // Calculate multipliers from achievements
  const getAchievementMultipliers = () => {
    let knowledgeMult = 1;
    let goldMult = 1;
    let allMult = 1;
    let buildingMult = 1;
    let heroMult = 1;

    gameState.achievements.forEach(ach => {
      if (!ach.unlocked) return;
      if (ach.id === 'first_skill') knowledgeMult += 0.05;
      if (ach.id === 'skill_10') knowledgeMult += 0.10;
      if (ach.id === 'skill_25') knowledgeMult += 0.15;
      if (ach.id === 'skill_50') knowledgeMult += 0.25;
      if (ach.id === 'skill_all') allMult += 0.50;
      if (ach.id === 'knowledge_100') knowledgeMult += 0.1;
      if (ach.id === 'knowledge_1000') knowledgeMult += 0.2;
      if (ach.id === 'knowledge_10000') knowledgeMult += 0.3;
      if (ach.id === 'gold_100') goldMult += 0.1;
      if (ach.id === 'gold_1000') goldMult += 0.2;
      if (ach.id === 'pop_100') allMult += 0.10;
      if (ach.id === 'pop_1000') allMult += 0.20;
      if (ach.id === 'building_10') buildingMult += 0.10;
      if (ach.id === 'building_50') buildingMult += 0.25;
      if (ach.id === 'hero_1') heroMult += 0.05;
      if (ach.id === 'hero_5') heroMult += 0.15;
      if (ach.id === 'age_2') allMult += 0.10;
      if (ach.id === 'age_4') allMult += 0.25;
      if (ach.id === 'age_6') allMult += 0.50;
    });

    return { knowledgeMult, goldMult, allMult, buildingMult, heroMult };
  };

  // Resource production
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        const newResources = { ...prev.resources };
        const keys = Object.keys(prev.production) as Array<keyof Resources>;
        
        // Apply prestige bonus (1% per prestige level)
        const prestigeBonus = 1 + (prev.prestigeLevel * 0.01);
        const { allMult } = getAchievementMultipliers();
        
        keys.forEach(key => {
          const gain = (prev.production[key] / 10) * prestigeBonus * allMult;
          newResources[key] += gain;
        });

        // Track lifetime production
        const newLifetime = { ...prev.lifetimeProduction };
        keys.forEach(key => {
          newLifetime[key] += (prev.production[key] / 10) * prestigeBonus * allMult;
        });

        // Age progress
        const currentRequirement = AGES[prev.currentAge]?.requirement || 0;
        const nextRequirement = AGES[prev.currentAge + 1]?.requirement || Infinity;
        const ageProgress = ((prev.totalKnowledgeEarned - currentRequirement) / (nextRequirement - currentRequirement)) * 100;

        let newAge = prev.currentAge;
        const newEvents = [...prev.events];

        if (prev.totalKnowledgeEarned >= nextRequirement && prev.currentAge < AGES.length - 1) {
          newAge++;
          newEvents.unshift({
            id: `age_${Date.now()}`,
            title: `Welcome to the ${AGES[newAge].name}!`,
            description: AGES[newAge].description,
            timestamp: Date.now()
          });
        }

        return {
          ...prev,
          resources: newResources,
          ageProgress: Math.min(ageProgress, 100),
          currentAge: newAge,
          events: newEvents.slice(0, 15),
          lifetimeProduction: newLifetime,
          totalKnowledgeEarned: prev.totalKnowledgeEarned + (prev.production.knowledge / 10) * prestigeBonus * allMult,
          totalGoldEarned: prev.totalGoldEarned + (prev.production.gold / 10) * prestigeBonus * allMult
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Check achievements
  useEffect(() => {
    setGameState(prev => {
      const newAchievements = prev.achievements.map(ach => {
        if (ach.unlocked) return ach;
        
        const skillCount = prev.skills.filter(s => s.unlocked).length;
        const buildingLevels = prev.buildings.reduce((sum, b) => sum + b.level, 0);
        const heroCount = prev.heroes.filter(h => h.unlocked).length;

        if (ach.id === 'first_skill' && skillCount >= 1) return { ...ach, unlocked: true };
        if (ach.id === 'skill_10' && skillCount >= 10) return { ...ach, unlocked: true };
        if (ach.id === 'skill_25' && skillCount >= 25) return { ...ach, unlocked: true };
        if (ach.id === 'skill_50' && skillCount >= 50) return { ...ach, unlocked: true };
        if (ach.id === 'skill_all' && skillCount >= prev.skills.length) return { ...ach, unlocked: true };
        
        if (ach.id === 'knowledge_100' && prev.resources.knowledge >= 100) return { ...ach, unlocked: true };
        if (ach.id === 'knowledge_1000' && prev.resources.knowledge >= 1000) return { ...ach, unlocked: true };
        if (ach.id === 'knowledge_10000' && prev.resources.knowledge >= 10000) return { ...ach, unlocked: true };
        
        if (ach.id === 'gold_100' && prev.resources.gold >= 100) return { ...ach, unlocked: true };
        if (ach.id === 'gold_1000' && prev.resources.gold >= 1000) return { ...ach, unlocked: true };
        
        if (ach.id === 'pop_100' && prev.resources.population >= 100) return { ...ach, unlocked: true };
        if (ach.id === 'pop_1000' && prev.resources.population >= 1000) return { ...ach, unlocked: true };
        
        if (ach.id === 'building_10' && buildingLevels >= 10) return { ...ach, unlocked: true };
        if (ach.id === 'building_50' && buildingLevels >= 50) return { ...ach, unlocked: true };
        
        if (ach.id === 'hero_1' && heroCount >= 1) return { ...ach, unlocked: true };
        if (ach.id === 'hero_5' && heroCount >= 5) return { ...ach, unlocked: true };
        
        if (ach.id === 'age_2' && prev.currentAge >= 1) return { ...ach, unlocked: true };
        if (ach.id === 'age_4' && prev.currentAge >= 3) return { ...ach, unlocked: true };
        if (ach.id === 'age_6' && prev.currentAge >= 5) return { ...ach, unlocked: true };
        
        return ach;
      });

      return { ...prev, achievements: newAchievements };
    });
  }, [gameState.resources, gameState.skills, gameState.buildings, gameState.heroes, gameState.currentAge]);

  const unlockSkill = (skillId: string) => {
    setGameState(prev => {
      const skill = prev.skills.find(s => s.id === skillId);
      if (!skill || skill.unlocked) return prev;

      if (!skill.prerequisites.every(prereq => prev.skills.find(s => s.id === prereq)?.unlocked)) return prev;
      if (prev.resources.knowledge < skill.cost.knowledge) return prev;

      const newResources = { ...prev.resources };
      newResources.knowledge -= skill.cost.knowledge;

      const newProduction = applySkillEffect({ ...prev.production }, skill.id);
      const newSkills = prev.skills.map(s => s.id === skillId ? { ...s, unlocked: true } : s);

      const newEvents = [...prev.events];
      newEvents.unshift({
        id: `skill_${Date.now()}`,
        title: `${skill.name} Unlocked!`,
        description: skill.effect,
        timestamp: Date.now()
      });

      return {
        ...prev,
        resources: newResources,
        production: newProduction,
        skills: newSkills,
        events: newEvents.slice(0, 15)
      };
    });
  };

  const applySkillEffect = (production: Resources, skillId: string): Resources => {
    const p = { ...production };
    
    // Tier 1 Economy
    if (skillId === 'farming1') p.food += 0.5;
    if (skillId === 'woodcutting1') p.wood += 0.3;
    if (skillId === 'mining1') p.stone += 0.2;
    if (skillId === 'gathering') {
      p.food *= 1.1; p.wood *= 1.1; p.stone *= 1.1;
    }
    
    // Tier 1 Tech
    if (skillId === 'writing') p.knowledge += 0.3;
    if (skillId === 'tools1') {
      Object.keys(p).forEach(k => { p[k as keyof Resources] *= 1.1; });
    }
    if (skillId === 'housing') p.population += 0.1;
    
    // Tier 1 Military
    if (skillId === 'archery') p.food += 0.2;
    if (skillId === 'tactics') p.gold += 0.1;
    
    // Tier 2 Economy
    if (skillId === 'farming2') p.food += 1.5;
    if (skillId === 'irrigation') { p.food += 2.0; p.population += 0.2; }
    if (skillId === 'woodcutting2') p.wood += 1.0;
    if (skillId === 'sawmill') p.wood += 1.5;
    if (skillId === 'mining2') p.stone += 0.8;
    if (skillId === 'quarry') p.stone += 1.2;
    if (skillId === 'commerce') p.gold += 0.1;
    
    // Tier 2 Tech
    if (skillId === 'mathematics') p.knowledge += 0.5;
    if (skillId === 'library') p.knowledge += 1.0;
    if (skillId === 'tools2') {
      Object.keys(p).forEach(k => { p[k as keyof Resources] *= 1.15; });
    }
    if (skillId === 'ironworking') p.iron += 0.1;
    if (skillId === 'engineering') {
      // Building bonus applied elsewhere
    }
    
    // Tier 2 Military
    if (skillId === 'cavalry') p.food += 0.5;
    
    // Magic
    if (skillId === 'meditation') p.mana += 0.1;
    if (skillId === 'mysticism') p.knowledge += 0.2;
    if (skillId === 'alchemy') {
      p.food += 0.8; p.wood += 0.8; p.stone += 0.8; p.iron += 0.3; p.gold += 0.3;
    }
    if (skillId === 'enchanting') {
      Object.keys(p).forEach(k => { p[k as keyof Resources] *= 1.3; });
    }
    
    // Tier 3 Economy
    if (skillId === 'farming3') p.food += 3.0;
    if (skillId === 'plantation') { p.food += 4.0; p.population += 0.5; }
    if (skillId === 'woodcutting3') p.wood += 2.5;
    if (skillId === 'lumbermill') p.wood += 3.5;
    if (skillId === 'mining3') p.stone += 2.0;
    if (skillId === 'deepmine') { p.stone += 3.0; p.iron += 0.5; }
    if (skillId === 'banking') p.gold += 0.5;
    if (skillId === 'trade') {
      p.gold += 1.0;
      Object.keys(p).forEach(k => { p[k as keyof Resources] *= 1.2; });
    }
    
    // Tier 3 Tech
    if (skillId === 'academy') p.knowledge += 2.0;
    if (skillId === 'philosophy') p.knowledge += 2.5;
    if (skillId === 'tools3') {
      Object.keys(p).forEach(k => { p[k as keyof Resources] *= 1.25; });
    }
    if (skillId === 'metallurgy') p.iron += 0.8;
    if (skillId === 'astronomy') p.knowledge += 3.0;
    
    // Tier 3 Military & Magic
    if (skillId === 'castle') {
      Object.keys(p).forEach(k => { p[k as keyof Resources] += 2.0; });
    }
    if (skillId === 'knighthood') p.gold += 1.5;
    if (skillId === 'spellcraft') p.mana += 1.0;
    if (skillId === 'wizardtower') { p.mana += 2.0; p.knowledge += 2.0; }
    
    // Tier 4
    if (skillId === 'farming4') p.food += 6.0;
    if (skillId === 'granary') { p.food += 8.0; p.population += 1.0; }
    if (skillId === 'goldmine') { p.gold += 2.0; p.iron += 1.0; }
    if (skillId === 'marketplace') {
      p.gold += 3.0;
      p.food *= 1.3; p.wood *= 1.3; p.stone *= 1.3;
    }
    if (skillId === 'university') p.knowledge += 5.0;
    if (skillId === 'science') {
      p.knowledge += 6.0;
      Object.keys(p).forEach(k => { p[k as keyof Resources] *= 1.5; });
    }
    if (skillId === 'masterwork') {
      Object.keys(p).forEach(k => { p[k as keyof Resources] *= 1.4; });
    }
    if (skillId === 'fortress') {
      Object.keys(p).forEach(k => { p[k as keyof Resources] += 3.0; });
    }
    if (skillId === 'champion') p.gold += 4.0;
    if (skillId === 'archmage') p.mana += 3.0;
    if (skillId === 'ritual') {
      p.mana += 2.5;
      Object.keys(p).forEach(k => { p[k as keyof Resources] += 2.0; });
    }
    if (skillId === 'sorcery') {
      p.mana += 5.0;
      Object.keys(p).forEach(k => { p[k as keyof Resources] *= 1.6; });
    }
    
    // Divine
    if (skillId === 'religion') p.faith += 0.1;
    if (skillId === 'temple') p.faith += 0.5;
    if (skillId === 'clergy') { p.faith += 0.8; p.knowledge += 0.5; }
    if (skillId === 'cathedral') p.faith += 2.0;
    if (skillId === 'miracle') {
      p.faith += 3.0;
      Object.keys(p).forEach(k => { p[k as keyof Resources] += 1.5; });
    }
    if (skillId === 'holycity') { p.faith += 5.0; p.gold += 3.0; }
    if (skillId === 'ascension') {
      Object.keys(p).forEach(k => { p[k as keyof Resources] += 10.0; });
    }
    
    // Tier 5 Arcane
    if (skillId === 'arcanelibrary') { p.knowledge += 8.0; p.mana += 4.0; }
    if (skillId === 'timemage') {
      Object.keys(p).forEach(k => { p[k as keyof Resources] *= 2.0; });
    }
    if (skillId === 'worldgate') {
      p.gems += 0.5;
      Object.keys(p).forEach(k => { p[k as keyof Resources] += 5.0; });
    }
    if (skillId === 'omniscience') {
      p.knowledge += 15.0;
      Object.keys(p).forEach(k => { 
        p[k as keyof Resources] += 10.0;
        p[k as keyof Resources] *= 2.5;
      });
    }
    
    return p;
  };

  const upgradeBuilding = (buildingId: string) => {
    setGameState(prev => {
      const building = prev.buildings.find(b => b.id === buildingId);
      if (!building) return prev;

      const costMultiplier = Math.pow(1.15, building.level);
      const canAfford = Object.entries(building.baseCost).every(([resource, cost]) => {
        return prev.resources[resource as keyof Resources] >= cost * costMultiplier;
      });

      if (!canAfford) return prev;

      const newResources = { ...prev.resources };
      Object.entries(building.baseCost).forEach(([resource, cost]) => {
        newResources[resource as keyof Resources] -= cost * costMultiplier;
      });

      const newProduction = { ...prev.production };
      Object.entries(building.production).forEach(([resource, prod]) => {
        newProduction[resource as keyof Resources] += prod;
      });

      // Workshop gives 5% boost per level
      if (building.id === 'workshop') {
        Object.keys(newProduction).forEach(k => {
          newProduction[k as keyof Resources] *= 1.05;
        });
      }

      const newBuildings = prev.buildings.map(b =>
        b.id === buildingId ? { ...b, level: b.level + 1 } : b
      );

      const newEvents = [...prev.events];
      newEvents.unshift({
        id: `building_${Date.now()}`,
        title: `${building.name} Upgraded!`,
        description: `Now level ${building.level + 1}`,
        timestamp: Date.now()
      });

      return {
        ...prev,
        resources: newResources,
        production: newProduction,
        buildings: newBuildings,
        events: newEvents.slice(0, 15)
      };
    });
  };

  const upgradeHero = (heroId: string) => {
    setGameState(prev => {
      const hero = prev.heroes.find(h => h.id === heroId);
      if (!hero) return prev;

      const costMultiplier = hero.unlocked ? Math.pow(1.5, hero.level) : 1;
      const canAfford = Object.entries(hero.cost).every(([resource, cost]) => {
        return prev.resources[resource as keyof Resources] >= cost * costMultiplier;
      });

      if (!canAfford) return prev;

      const newResources = { ...prev.resources };
      Object.entries(hero.cost).forEach(([resource, cost]) => {
        newResources[resource as keyof Resources] -= cost * costMultiplier;
      });

      const newProduction = applyHeroBonus({ ...prev.production }, heroId, hero.level + 1);

      const newHeroes = prev.heroes.map(h =>
        h.id === heroId ? { ...h, level: h.level + 1, unlocked: true } : h
      );

      const newEvents = [...prev.events];
      newEvents.unshift({
        id: `hero_${Date.now()}`,
        title: hero.unlocked ? `${hero.name} Leveled Up!` : `${hero.name} Recruited!`,
        description: `Now level ${hero.level + 1}`,
        timestamp: Date.now()
      });

      return {
        ...prev,
        resources: newResources,
        production: newProduction,
        heroes: newHeroes,
        events: newEvents.slice(0, 15)
      };
    });
  };

  const applyHeroBonus = (production: Resources, heroId: string, level: number): Resources => {
    const p = { ...production };
    const bonus = level * 0.5; // 50% per level

    if (heroId === 'farmer') p.food *= (1 + bonus);
    if (heroId === 'lumberjack') p.wood *= (1 + bonus);
    if (heroId === 'miner') { p.stone *= (1 + bonus); p.iron *= (1 + bonus); }
    if (heroId === 'merchant') p.gold *= (1 + (level * 1.0));
    if (heroId === 'scholar') p.knowledge *= (1 + (level * 0.75));
    if (heroId === 'priest') p.faith *= (1 + (level * 1.0));
    if (heroId === 'wizard') p.mana *= (1 + (level * 1.0));
    if (heroId === 'king') {
      Object.keys(p).forEach(k => {
        p[k as keyof Resources] *= (1 + (level * 0.25));
      });
    }

    return p;
  };

  const performPrestige = () => {
    if (gameState.totalKnowledgeEarned < 10000) {
      alert('You need at least 10,000 lifetime knowledge to prestige!');
      return;
    }

    if (!confirm('Prestige will reset most progress but grant permanent bonuses. Continue?')) {
      return;
    }

    const prestigePoints = Math.floor(Math.log10(gameState.totalKnowledgeEarned) - 3);

    setGameState(prev => ({
      ...prev,
      prestigeLevel: prev.prestigeLevel + 1,
      prestigePoints: prev.prestigePoints + prestigePoints,
      currentAge: 0,
      ageProgress: 0,
      resources: {
        population: 10,
        food: 100,
        wood: 50,
        stone: 30,
        iron: 0,
        gold: 0,
        mana: 0,
        knowledge: 0,
        faith: 0,
        gems: prev.resources.gems // Keep gems
      },
      production: {
        population: 0.05,
        food: 0.5,
        wood: 0.3,
        stone: 0.2,
        iron: 0,
        gold: 0,
        mana: 0,
        knowledge: 0.1,
        faith: 0,
        gems: 0
      },
      skills: prev.skills.map(s => ({ ...s, unlocked: false })),
      buildings: prev.buildings.map(b => ({ ...b, level: 0 })),
      heroes: prev.heroes.map(h => ({ ...h, level: 0, unlocked: false })),
      totalKnowledgeEarned: 0,
      totalGoldEarned: 0,
      events: [{
        id: `prestige_${Date.now()}`,
        title: 'Prestige!',
        description: `Gained ${prestigePoints} prestige points! (+${prev.prestigeLevel + 1}% all production)`,
        timestamp: Date.now()
      }]
    }));
  };

  const resetGame = () => {
    if (confirm('Reset ALL progress? This cannot be undone!')) {
      localStorage.removeItem('medievalKingdomExtreme');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-4 max-w-[1800px]">
        <GameHeader 
          currentAge={AGES[gameState.currentAge].name}
          ageProgress={gameState.ageProgress}
          prestigeLevel={gameState.prestigeLevel}
          onReset={resetGame}
        />

        {/* Tab Navigation */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {(['skills', 'buildings', 'heroes', 'achievements', 'prestige'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg transition-all ${
                activeTab === tab
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
          <div className="lg:col-span-3 space-y-4">
            <StoryPanel 
              age={AGES[gameState.currentAge]}
              ageIndex={gameState.currentAge}
            />
            
            {activeTab === 'skills' && (
              <SkillTree 
                skills={gameState.skills}
                knowledge={gameState.resources.knowledge}
                onUnlock={unlockSkill}
              />
            )}

            {activeTab === 'buildings' && (
              <Buildings 
                buildings={gameState.buildings}
                resources={gameState.resources}
                onUpgrade={upgradeBuilding}
              />
            )}

            {activeTab === 'heroes' && (
              <Heroes 
                heroes={gameState.heroes}
                resources={gameState.resources}
                onUpgrade={upgradeHero}
              />
            )}

            {activeTab === 'achievements' && (
              <Achievements achievements={gameState.achievements} />
            )}

            {activeTab === 'prestige' && (
              <PrestigePanel 
                prestigeLevel={gameState.prestigeLevel}
                prestigePoints={gameState.prestigePoints}
                totalKnowledge={gameState.totalKnowledgeEarned}
                onPrestige={performPrestige}
              />
            )}
          </div>

          <div className="space-y-4">
            <ResourcePanel 
              resources={gameState.resources}
              production={gameState.production}
            />
            
            <EventLog events={gameState.events} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
