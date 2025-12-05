const AGES = [
  { name: 'Dark Age', description: 'Survival is all that matters.', requirement: 0 },
  { name: 'Age of Growth', description: 'Villages blossom into towns.', requirement: 500 },
  { name: 'Age of Discovery', description: 'Knowledge spreads through libraries and guilds.', requirement: 2500 },
  { name: 'Age of Steel', description: 'Forged iron arms your soldiers and workers.', requirement: 7000 },
  { name: 'Age of Arcana', description: 'Magic is woven into everyday life.', requirement: 16000 },
  { name: 'Age of Legends', description: 'Heroes walk the streets and myths are born.', requirement: 35000 }
];

const state = {
  resources: {
    population: 15,
    food: 120,
    wood: 60,
    stone: 30,
    iron: 0,
    gold: 0,
    mana: 0,
    knowledge: 0,
    faith: 0,
    gems: 0
  },
  production: {
    population: 0.08,
    food: 0.6,
    wood: 0.4,
    stone: 0.25,
    iron: 0,
    gold: 0,
    mana: 0,
    knowledge: 0.2,
    faith: 0,
    gems: 0
  },
  ageIndex: 0,
  relics: 0,
  events: [],
  achievements: [],
  unlockedQuests: false,
  totalKnowledgeEarned: 0,
  totalGoldEarned: 0,
};

const buildingData = [
  {
    id: 'farm',
    name: 'Farmstead',
    description: 'Grows surplus crops for your people.',
    baseCost: { wood: 20, food: 30 },
    production: { food: 1.2, population: 0.02 },
    level: 0,
    category: 'economy'
  },
  {
    id: 'lumberyard',
    name: 'Lumberyard',
    description: 'Processes timber efficiently.',
    baseCost: { food: 15, wood: 35 },
    production: { wood: 1.5 },
    level: 0,
    category: 'economy'
  },
  {
    id: 'quarry',
    name: 'Quarry',
    description: 'Extracts stone for sturdy walls.',
    baseCost: { wood: 40, food: 25 },
    production: { stone: 0.9 },
    level: 0,
    category: 'industry'
  },
  {
    id: 'mine',
    name: 'Iron Mine',
    description: 'Digs deep veins for iron ore.',
    baseCost: { wood: 60, stone: 45 },
    production: { iron: 0.4 },
    level: 0,
    category: 'industry'
  },
  {
    id: 'market',
    name: 'Grand Market',
    description: 'Merchants trade spices and crafts for gold.',
    baseCost: { wood: 90, stone: 70, food: 50 },
    production: { gold: 0.5 },
    level: 0,
    category: 'economy'
  },
  {
    id: 'temple',
    name: 'Temple of Dawn',
    description: 'Priests gather faith and inspire the populace.',
    baseCost: { stone: 120, food: 80, gold: 40 },
    production: { faith: 0.4, population: 0.05 },
    level: 0,
    category: 'divine'
  },
  {
    id: 'tower',
    name: 'Arcane Spire',
    description: 'Channels raw mana into knowledge.',
    baseCost: { stone: 160, iron: 60, gold: 60 },
    production: { mana: 0.5, knowledge: 0.5 },
    level: 0,
    category: 'magic'
  },
  {
    id: 'guild',
    name: 'Explorer Guild',
    description: 'Unlocks quests and improves quest rewards.',
    baseCost: { wood: 120, stone: 100, knowledge: 600 },
    production: { knowledge: 0.8 },
    level: 0,
    category: 'utility'
  }
];

const skillData = [
  {
    id: 'writing',
    name: 'Writing',
    description: 'Scribes record your lore. +0.3 knowledge/s.',
    cost: 80,
    unlocked: false,
    effect: () => (state.production.knowledge += 0.3)
  },
  {
    id: 'irrigation',
    name: 'Irrigation',
    description: 'Water channels double farm food output.',
    cost: 140,
    unlocked: false,
    effect: () => multiplyProduction('food', 0.2)
  },
  {
    id: 'steel',
    name: 'Steel Forging',
    description: 'Improves metalworking. +0.2 iron/s and +10% stone output.',
    cost: 220,
    unlocked: false,
    effect: () => {
      state.production.iron += 0.2;
      multiplyProduction('stone', 0.1);
    }
  },
  {
    id: 'astronomy',
    name: 'Astronomy',
    description: 'Scholars map the heavens. +0.5 knowledge/s, +0.1 mana/s.',
    cost: 380,
    unlocked: false,
    effect: () => {
      state.production.knowledge += 0.5;
      state.production.mana += 0.1;
    }
  },
  {
    id: 'alchemy',
    name: 'Alchemy',
    description: 'Transmute base metals. +0.2 gold/s and +0.1 gems/s.',
    cost: 520,
    unlocked: false,
    effect: () => {
      state.production.gold += 0.2;
      state.production.gems += 0.1;
    }
  },
  {
    id: 'battleMagic',
    name: 'Battle Magic',
    description: 'Mana fuels soldiers. +15% total production while mana > 100.',
    cost: 750,
    unlocked: false,
    effect: () => logEvent('Mana surges empower your armies. Production surges when mana is high.')
  }
];

const heroData = [
  {
    id: 'steward',
    name: 'Village Steward',
    description: 'Balances supplies. +10% food and wood.',
    cost: { gold: 60, food: 80 },
    hired: false,
    effect: () => {
      multiplyProduction('food', 0.1);
      multiplyProduction('wood', 0.1);
    }
  },
  {
    id: 'battlemage',
    name: 'Battle Mage',
    description: 'Spells speed up mining. +20% stone and iron.',
    cost: { gold: 120, mana: 40 },
    hired: false,
    effect: () => {
      multiplyProduction('stone', 0.2);
      multiplyProduction('iron', 0.2);
    }
  },
  {
    id: 'explorer',
    name: 'Frontier Explorer',
    description: 'Finds new lands. +1 quest capacity and +10% knowledge.',
    cost: { gold: 180, knowledge: 200 },
    hired: false,
    effect: () => {
      questManager.maxActive += 1;
      multiplyProduction('knowledge', 0.1);
      state.unlockedQuests = true;
      logEvent('The explorer opens paths to distant ruins. Quests unlocked!');
      renderQuests();
    }
  },
  {
    id: 'oracle',
    name: 'Oracle of Dawn',
    description: 'Whispers of the future. +15% to all production.',
    cost: { gold: 260, faith: 120, gems: 40 },
    hired: false,
    effect: () => multiplyAllProduction(0.15)
  }
];

const questManager = {
  list: [
    {
      id: 'ruins',
      name: 'Ruined Watchtower',
      description: 'Search for old maps and charts.',
      reward: () => {
        state.resources.knowledge += 200;
        state.resources.gold += 40;
        logEvent('Your scouts recover dusty scrolls of forgotten borders.');
      },
      unlocked: () => state.ageIndex >= 2,
      running: false,
      duration: 20,
      timer: 0
    },
    {
      id: 'spire',
      name: 'Crystal Spire',
      description: 'Harvest glowing shards for arcane power.',
      reward: () => {
        state.resources.mana += 150;
        state.resources.gems += 15;
        logEvent('The spire hums with energy. Mana floods your coffers.');
      },
      unlocked: () => state.ageIndex >= 3,
      running: false,
      duration: 25,
      timer: 0
    },
    {
      id: 'sanctum',
      name: 'Hidden Sanctum',
      description: 'Seek relics guarded by ancient spirits.',
      reward: () => {
        state.resources.faith += 180;
        state.resources.gems += 25;
        logEvent('Spirits are appeased, granting blessed relics.');
      },
      unlocked: () => state.ageIndex >= 4,
      running: false,
      duration: 30,
      timer: 0
    }
  ],
  maxActive: 1,
  active: 0
};

const achievements = [
  { id: 'firstGold', name: 'Coin Collector', description: 'Earn 100 total gold.', condition: () => state.totalGoldEarned >= 100, unlocked: false },
  { id: 'scribes', name: 'Library Opened', description: 'Reach 1000 knowledge.', condition: () => state.totalKnowledgeEarned >= 1000, unlocked: false },
  { id: 'ironWall', name: 'Iron Wall', description: 'Own 3 quarries and 2 iron mines.', condition: () => getBuilding('quarry').level >= 3 && getBuilding('mine').level >= 2, unlocked: false },
  { id: 'faithful', name: 'Hymns Rise', description: 'Generate 100 faith.', condition: () => state.resources.faith >= 100, unlocked: false },
  { id: 'legend', name: 'Legendary Age', description: 'Reach the Age of Legends.', condition: () => state.ageIndex === AGES.length - 1, unlocked: false }
];

function format(num) {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
  if (num >= 10_000) return (num / 1000).toFixed(1) + 'k';
  return num.toFixed(1);
}

function getBuilding(id) {
  return buildingData.find(b => b.id === id);
}

function multiplyProduction(resource, bonus) {
  state.production[resource] += state.production[resource] * bonus;
}

function multiplyAllProduction(bonus) {
  Object.keys(state.production).forEach(key => {
    state.production[key] += state.production[key] * bonus;
  });
}

function affordable(cost) {
  return Object.entries(cost).every(([key, amount]) => state.resources[key] >= amount);
}

function payCost(cost) {
  Object.entries(cost).forEach(([key, amount]) => {
    state.resources[key] -= amount;
  });
}

function calculateCost(baseCost, level) {
  const multiplier = 1 + level * 0.18;
  const cost = {};
  Object.entries(baseCost).forEach(([key, amount]) => {
    cost[key] = Math.ceil(amount * multiplier);
  });
  return cost;
}

function applyRelics() {
  const bonus = 1 + state.relics * 0.05;
  multiplyAllProduction(bonus - 1);
}

function logEvent(text) {
  state.events.unshift({ text, timestamp: Date.now() });
  if (state.events.length > 12) state.events.pop();
  renderEvents();
}

function buyBuilding(building) {
  const cost = calculateCost(building.baseCost, building.level);
  if (!affordable(cost)) return;
  payCost(cost);
  building.level += 1;
  Object.entries(building.production).forEach(([key, amount]) => {
    state.production[key] += amount;
  });
  renderBuildings();
  renderResources();
}

function learnSkill(skill) {
  if (skill.unlocked || state.resources.knowledge < skill.cost) return;
  state.resources.knowledge -= skill.cost;
  skill.unlocked = true;
  skill.effect();
  logEvent(`You mastered ${skill.name}.`);
  renderSkills();
  renderResources();
}

function hireHero(hero) {
  if (hero.hired || !affordable(hero.cost)) return;
  payCost(hero.cost);
  hero.hired = true;
  hero.effect();
  logEvent(`${hero.name} swears allegiance.`);
  renderHeroes();
  renderResources();
}

function tick(delta) {
  Object.entries(state.production).forEach(([key, amount]) => {
    const gain = amount * delta;
    state.resources[key] += gain;
    if (key === 'knowledge') state.totalKnowledgeEarned += gain;
    if (key === 'gold') state.totalGoldEarned += gain;
  });

  if (state.resources.mana > 100 && skillData.find(s => s.id === 'battleMagic')?.unlocked) {
    multiplyAllProduction(0.0005 * delta); // small rolling boost while mana is high
  }

  updateAge();
  questManager.list.forEach(quest => updateQuest(quest, delta));
  checkAchievements();
  renderResources();
}

function updateAge() {
  const nextAge = AGES[state.ageIndex + 1];
  const currentAge = AGES[state.ageIndex];
  const requirement = nextAge ? nextAge.requirement : currentAge.requirement;
  if (nextAge && state.totalKnowledgeEarned >= requirement) {
    state.ageIndex += 1;
    logEvent(`Your realm enters the ${AGES[state.ageIndex].name}.`);
  }
  const progress = nextAge ? (state.totalKnowledgeEarned / requirement) * 100 : 100;
  document.getElementById('ageBar').style.width = `${Math.min(100, progress)}%`;
  document.getElementById('ageName').textContent = currentAge.name;
  document.getElementById('ageDescription').textContent = currentAge.description;
  document.getElementById('ageRequirement').textContent = nextAge ? `Earn ${nextAge.requirement} total knowledge to reach the ${nextAge.name}.` : 'You have reached the peak of legend.';

  if (state.ageIndex >= 2 && !state.unlockedQuests) {
    state.unlockedQuests = true;
    logEvent('Exploration parties are ready to depart. Quests unlocked!');
    renderQuests();
  }
}

function updateQuest(quest, delta) {
  if (!quest.unlocked()) return;
  if (!quest.running) return;
  quest.timer -= delta;
  if (quest.timer <= 0) {
    quest.running = false;
    quest.timer = 0;
    quest.reward();
    questManager.active -= 1;
    renderQuests();
    renderResources();
  }
}

function startQuest(quest) {
  if (!quest.unlocked() || quest.running || questManager.active >= questManager.maxActive) return;
  quest.running = true;
  quest.timer = quest.duration;
  questManager.active += 1;
  logEvent(`Your party departs for the ${quest.name}.`);
  renderQuests();
}

function checkAchievements() {
  achievements.forEach(achievement => {
    if (!achievement.unlocked && achievement.condition()) {
      achievement.unlocked = true;
      logEvent(`Achievement unlocked: ${achievement.name}!`);
      renderAchievements();
    }
  });
}

function prestige() {
  if (state.ageIndex < 2 || state.totalKnowledgeEarned < 3000) return;
  const earned = Math.floor(state.totalKnowledgeEarned / 3000) + state.ageIndex;
  state.relics += earned;
  state.resources.population = 15;
  Object.keys(state.resources).forEach(key => {
    if (key !== 'population') state.resources[key] = 0;
  });
  Object.keys(state.production).forEach(key => {
    state.production[key] = 0;
  });
  Object.assign(state.production, {
    population: 0.08,
    food: 0.6,
    wood: 0.4,
    stone: 0.25,
    iron: 0,
    gold: 0,
    mana: 0,
    knowledge: 0.2,
    faith: 0,
    gems: 0
  });
  buildingData.forEach(b => b.level = 0);
  skillData.forEach(s => s.unlocked = false);
  heroData.forEach(h => h.hired = false);
  state.ageIndex = 0;
  state.unlockedQuests = false;
  state.totalKnowledgeEarned = 0;
  state.totalGoldEarned = 0;
  applyRelics();
  logEvent(`You ascend, gaining ${earned} relics. Production empowered!`);
  renderAll();
}

function createResourceRow(name, value, production) {
  return `<div class="resource"><p class="label">${name}</p><p class="value">${format(value)}</p><p class="muted">+${production.toFixed(2)}/s</p></div>`;
}

function renderResources() {
  const list = document.getElementById('resourceList');
  list.innerHTML = '';
  const entries = [
    ['Population', 'population'],
    ['Food', 'food'],
    ['Wood', 'wood'],
    ['Stone', 'stone'],
    ['Iron', 'iron'],
    ['Gold', 'gold'],
    ['Mana', 'mana'],
    ['Knowledge', 'knowledge'],
    ['Faith', 'faith'],
    ['Gems', 'gems']
  ];
  entries.forEach(([label, key]) => {
    list.innerHTML += createResourceRow(label, state.resources[key], state.production[key] || 0);
  });
  document.getElementById('relics').textContent = state.relics.toString();
}

function renderBuildings() {
  const container = document.getElementById('buildingList');
  container.innerHTML = '';
  buildingData.forEach(building => {
    const cost = calculateCost(building.baseCost, building.level);
    const btnDisabled = !affordable(cost);
    const card = document.createElement('div');
    card.className = 'item';
    card.innerHTML = `
      <div>
        <p class="eyebrow">${building.category}</p>
        <h3>${building.name} <span class="muted">Lvl ${building.level}</span></h3>
        <p class="muted">${building.description}</p>
        <p class="muted">Production: ${Object.entries(building.production).map(([k,v]) => `+${v}/s ${k}`).join(', ')}</p>
        <p class="muted">Cost: ${Object.entries(cost).map(([k,v]) => `${v} ${k}`).join(', ')}</p>
      </div>
      <button class="primary" ${btnDisabled ? 'disabled' : ''}>Build</button>
    `;
    card.querySelector('button').addEventListener('click', () => buyBuilding(building));
    container.appendChild(card);
  });
  document.getElementById('buildingCount').textContent = `${buildingData.reduce((sum, b) => sum + b.level, 0)} built`;
}

function renderSkills() {
  const container = document.getElementById('skillList');
  container.innerHTML = '';
  skillData.forEach(skill => {
    const card = document.createElement('div');
    card.className = 'item';
    card.innerHTML = `
      <div>
        <p class="eyebrow">Research</p>
        <h3>${skill.name}</h3>
        <p class="muted">${skill.description}</p>
        <p class="muted">Cost: ${skill.cost} knowledge</p>
      </div>
      <button class="primary" ${skill.unlocked ? 'disabled' : ''}>${skill.unlocked ? 'Learned' : 'Study'}</button>
    `;
    card.querySelector('button').addEventListener('click', () => learnSkill(skill));
    container.appendChild(card);
  });
  document.getElementById('skillCount').textContent = `${skillData.filter(s => s.unlocked).length} learned`;
}

function renderHeroes() {
  const container = document.getElementById('heroList');
  container.innerHTML = '';
  heroData.forEach(hero => {
    const btnDisabled = hero.hired || !affordable(hero.cost);
    const card = document.createElement('div');
    card.className = 'item';
    card.innerHTML = `
      <div>
        <p class="eyebrow">Champion</p>
        <h3>${hero.name}</h3>
        <p class="muted">${hero.description}</p>
        <p class="muted">Cost: ${Object.entries(hero.cost).map(([k,v]) => `${v} ${k}`).join(', ')}</p>
      </div>
      <button class="primary" ${btnDisabled ? 'disabled' : ''}>${hero.hired ? 'Recruited' : 'Recruit'}</button>
    `;
    card.querySelector('button').addEventListener('click', () => hireHero(hero));
    container.appendChild(card);
  });
  document.getElementById('heroCount').textContent = `${heroData.filter(h => h.hired).length} recruited`;
}

function renderEvents() {
  const log = document.getElementById('eventLog');
  log.innerHTML = '';
  state.events.forEach(event => {
    const li = document.createElement('li');
    li.textContent = event.text;
    log.appendChild(li);
  });
}

function renderAchievements() {
  const list = document.getElementById('achievementList');
  list.innerHTML = '';
  achievements.forEach(ach => {
    const li = document.createElement('li');
    li.textContent = `${ach.name} — ${ach.description}${ach.unlocked ? '' : ' (locked)'}`;
    li.className = ach.unlocked ? 'unlocked' : '';
    list.appendChild(li);
  });
}

function renderQuests() {
  const status = document.getElementById('questStatus');
  const container = document.getElementById('questList');
  container.innerHTML = '';
  if (!state.unlockedQuests) {
    status.textContent = 'Send explorers to discover ancient secrets once you reach the Age of Discovery.';
    return;
  }
  status.textContent = `You can run ${questManager.maxActive} quest(s) at a time.`;
  questManager.list.filter(q => q.unlocked()).forEach(quest => {
    const card = document.createElement('div');
    card.className = 'quest';
    card.innerHTML = `
      <div>
        <h4>${quest.name}</h4>
        <p class="muted">${quest.description}</p>
        <p class="muted">Duration: ${quest.duration}s</p>
      </div>
      <button class="ghost" ${quest.running || questManager.active >= questManager.maxActive ? 'disabled' : ''}>${quest.running ? `In progress (${Math.ceil(quest.timer)}s)` : 'Send party'}</button>
    `;
    card.querySelector('button').addEventListener('click', () => startQuest(quest));
    container.appendChild(card);
  });
}

function renderAll() {
  renderResources();
  renderBuildings();
  renderSkills();
  renderHeroes();
  renderAchievements();
  renderEvents();
  renderQuests();
}

function addButtonHandlers() {
  document.getElementById('gatherFood').addEventListener('click', () => {
    state.resources.food += 4;
    logEvent('Villagers return with baskets of food.');
    renderResources();
  });
  document.getElementById('gatherWood').addEventListener('click', () => {
    state.resources.wood += 3;
    logEvent('Woodcutters haul fresh timber.');
    renderResources();
  });
  document.getElementById('gatherStone').addEventListener('click', () => {
    state.resources.stone += 2;
    logEvent('Miners deliver rough stone blocks.');
    renderResources();
  });
  document.getElementById('prestigeButton').addEventListener('click', prestige);
}

function gameLoop() {
  let last = performance.now();
  function frame(now) {
    const delta = (now - last) / 1000;
    last = now;
    tick(delta);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

applyRelics();
addButtonHandlers();
renderAll();
logEvent('A new realm begins under your guidance.');
gameLoop();
