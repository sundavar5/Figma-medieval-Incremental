import { Scroll } from 'lucide-react';

interface Age {
  name: string;
  description: string;
}

interface StoryPanelProps {
  age: Age;
  ageIndex: number;
}

const STORY_CONTENT = [
  {
    title: 'The Beginning',
    text: 'In the aftermath of a great calamity, your ancestors fled to this valley. The old kingdoms have fallen, and the world has been plunged into darkness. Your small village of survivors struggles to endure each harsh winter. But within your people burns the ember of civilization, waiting to be rekindled. You have been chosen as the leader - the one who will guide your people from mere survival to greatness.'
  },
  {
    title: 'Seeds of Civilization',
    text: 'Your people have learned to thrive, not just survive. Fields of grain sway in the breeze, and the sound of hammers rings from workshops. Trade routes are being established with neighboring settlements. Children are being taught to read and write. The dark times are not forgotten, but they no longer define your future. Your settlement is becoming something more - a beacon of hope in a recovering world.'
  },
  {
    title: 'The Awakening',
    text: 'Strange discoveries have been unearthed in ancient ruins. Scrolls containing forgotten knowledge, artifacts of unknown purpose, and whispers of powers long dormant. Scholars debate the nature of magic while engineers push the boundaries of what is possible. Your realm stands at a crossroads between the mystical and the mechanical. What path will you choose?'
  },
  {
    title: 'Rise of Power',
    text: 'Your kingdom has become a force that cannot be ignored. Knights in gleaming armor patrol your borders. Mighty walls surround your cities. Other realms seek your favor - or plot your downfall. The balance of power in this land shifts with every decision you make. Will you be a benevolent ruler or a conquering warlord? The choice shapes not just your kingdom, but the entire world.'
  },
  {
    title: 'The Golden Age',
    text: 'Legends speak of your realm across all known lands. Wizards weave spells in crystalline towers while artificers craft wonders in grand workshops. Your kingdom has achieved what was thought impossible - a harmonious blend of magic and technology, wisdom and power. Yet ancient prophecies speak of challenges yet to come. Are you ready to face what lies beyond the veil of the known world?'
  }
];

export function StoryPanel({ age, ageIndex }: StoryPanelProps) {
  const story = STORY_CONTENT[ageIndex] || STORY_CONTENT[0];

  return (
    <div className="bg-gradient-to-br from-amber-900 to-orange-950 rounded-lg shadow-xl p-6 border-2 border-amber-600">
      <div className="flex items-center gap-3 mb-4">
        <Scroll className="w-6 h-6 text-amber-300" />
        <h2 className="text-amber-100">{story.title}</h2>
      </div>
      
      <div className="bg-amber-950 bg-opacity-50 rounded-lg p-4 border border-amber-700">
        <p className="text-amber-200 leading-relaxed">
          {story.text}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-amber-400">Current Age: {age.name}</span>
        <span className="text-amber-500">Chapter {ageIndex + 1}/5</span>
      </div>
    </div>
  );
}
