import { ScrollText } from 'lucide-react';
import type { StoryEvent } from '../App';

interface EventLogProps {
  events: StoryEvent[];
}

export function EventLog({ events }: EventLogProps) {
  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-xl p-6 border-2 border-slate-600">
      <div className="flex items-center gap-2 mb-4">
        <ScrollText className="w-5 h-5 text-slate-300" />
        <h2 className="text-white">Recent Events</h2>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
        {events.length === 0 ? (
          <div className="text-slate-400 text-center py-8 text-sm">
            Your story begins here...
          </div>
        ) : (
          events.map(event => (
            <div 
              key={event.id}
              className="bg-slate-700 bg-opacity-40 rounded-lg p-3 border border-slate-600 hover:border-slate-500 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="text-slate-200 mb-1">{event.title}</h3>
                  <p className="text-slate-400 text-sm">{event.description}</p>
                </div>
                <span className="text-slate-500 text-xs whitespace-nowrap">
                  {getTimeAgo(event.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
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
