
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, ChevronRight, Plus, Sparkles, Trash2, BarChart3, Clock, Loader2 } from 'lucide-react';
import { getStoredEntries, deleteEntry } from '../services/dbService.ts';
import { getDailyPrompt } from '../services/geminiService.ts';
import { JournalEntry, User } from '../types.ts';
import { MOODS } from '../constants.tsx';

interface DashboardPageProps {
  user: User;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [prompt, setPrompt] = useState('Generating a fresh prompt for you...');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      try {
        const [data, p] = await Promise.all([
          getStoredEntries(user.id),
          getDailyPrompt()
        ]);
        setEntries(data);
        setPrompt(p);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initData();
  }, [user.id]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      try {
        await deleteEntry(id);
        setEntries(prev => prev.filter(en => en.id !== id));
      } catch (error) {
        alert("Failed to delete entry.");
      }
    }
  };

  const filteredEntries = useMemo(() => {
    return entries.filter(e => 
      e.title.toLowerCase().includes(search.toLowerCase()) || 
      e.content.toLowerCase().includes(search.toLowerCase())
    );
  }, [entries, search]);

  const moodStats = useMemo(() => {
    const counts: Record<string, number> = {};
    entries.forEach(e => {
      counts[e.mood] = (counts[e.mood] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [entries]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border-4 border-black rounded-[2.5rem] p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-4xl font-black mb-2 uppercase tracking-tight">Welcome, {user.name.split(' ')[0]}</h2>
            <p className="text-black/60 font-bold text-lg flex items-center gap-2">
              <Clock className="w-5 h-5" /> {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <div className="bg-slate-50 border-2 border-black p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles className="w-20 h-20 text-black" />
            </div>
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-3">Daily Prompt</span>
              <p className="text-xl font-bold leading-relaxed italic mb-4">"{prompt}"</p>
              <Link 
                to={`/new?prompt=${encodeURIComponent(prompt)}`} 
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-2 rounded-full font-black hover:bg-slate-800 transition-all hover:gap-3"
              >
                Write Now <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white border-4 border-black rounded-[2.5rem] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-xl font-black uppercase tracking-widest mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" /> Mood Stats
          </h3>
          {moodStats.length > 0 ? (
            <div className="space-y-4">
              {moodStats.slice(0, 3).map(([type, count]) => {
                const mood = MOODS.find(m => m.type === type);
                const percentage = Math.round((count / entries.length) * 100);
                return (
                  <div key={type} className="space-y-1">
                    <div className="flex justify-between text-sm font-black">
                      <span>{mood?.icon} {type}</span>
                      <span>{percentage}%</span>
                    </div>
                    <div className="h-3 bg-slate-100 border border-black rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-black transition-all duration-1000" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              <p className="text-[10px] font-bold text-black/40 pt-2 uppercase">Based on your last {entries.length} entries</p>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <BarChart3 className="w-10 h-10 mb-2" />
              <p className="text-sm font-bold">Write more to see trends</p>
            </div>
          )}
        </div>
      </section>

      <div className="flex flex-col md:flex-row gap-6 items-end justify-between border-b-4 border-black pb-6">
        <div>
          <h3 className="text-4xl font-black uppercase tracking-tighter">Your Library</h3>
          <p className="text-black/50 font-bold">Viewing {filteredEntries.length} reflection{filteredEntries.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
          <input
            type="text"
            placeholder="Search by title, keyword, or mood..."
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-black rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-100 font-bold placeholder:text-black/30"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-black" />
          <p className="font-black uppercase tracking-widest animate-pulse">Retrieving your thoughts...</p>
        </div>
      ) : filteredEntries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEntries.map((entry) => {
            const mood = MOODS.find(m => m.type === entry.mood);
            return (
              <Link 
                key={entry.id} 
                to={`/entry/${entry.id}`}
                className="group bg-white rounded-[2rem] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all flex flex-col h-full overflow-hidden"
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border-2 border-black flex items-center gap-2 uppercase ${mood?.color || 'bg-white'}`}>
                      {mood?.icon} {entry.mood}
                    </span>
                    <button 
                      onClick={(e) => handleDelete(entry.id, e)}
                      className="p-2 bg-white border-2 border-black rounded-full hover:bg-rose-50 hover:text-rose-600 transition-all opacity-0 group-hover:opacity-100"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h4 className="text-2xl font-black text-black mb-3 line-clamp-2 leading-tight group-hover:underline underline-offset-4">{entry.title}</h4>
                  <p className="text-black/70 font-medium text-base mb-8 flex-grow line-clamp-4 leading-relaxed">
                    {entry.content}
                  </p>
                  
                  <div className="flex items-center justify-between border-t-2 border-black pt-4 mt-auto">
                    <div className="flex items-center gap-2 text-black font-black text-xs uppercase tracking-wider">
                      <Calendar className="w-4 h-4" />
                      {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    {entry.aiAnalysis && (
                      <div className="bg-black text-white p-1.5 rounded-lg" title="Has AI Analysis">
                        <Sparkles className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 bg-slate-50 rounded-[3rem] border-4 border-dashed border-black">
          <div className="w-24 h-24 bg-white border-4 border-black rounded-full flex items-center justify-center mx-auto mb-8 text-black shadow-lg">
            <Plus className="w-12 h-12" />
          </div>
          <h4 className="text-3xl font-black text-black mb-4 uppercase tracking-tighter">A Blank Canvas Awaits</h4>
          <p className="text-black/60 mb-10 max-w-sm mx-auto font-bold text-lg">
            Every great journey begins with a single word. Start yours today.
          </p>
          <Link 
            to="/new" 
            className="bg-black hover:bg-slate-800 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-flex items-center gap-3 transition-all active:translate-y-1 active:shadow-none"
          >
            <Plus className="w-6 h-6" />
            Create First Entry
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
