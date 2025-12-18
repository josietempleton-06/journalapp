
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ChevronLeft, Save, Sparkles, Loader2, Calendar, Smile, BookOpen, Quote } from 'lucide-react';
import { saveEntry, getSingleEntry } from '../services/dbService';
import { analyzeJournalEntry } from '../services/geminiService';
import { JournalEntry, User, MoodType } from '../types';
import { MOODS } from '../constants';

interface EntryEditorPageProps {
  user: User;
}

const EntryEditorPage: React.FC<EntryEditorPageProps> = ({ user }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const promptText = queryParams.get('prompt');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(MoodType.HAPPY);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingEntry, setIsLoadingEntry] = useState(!!id);

  useEffect(() => {
    const fetchEntry = async () => {
      if (id) {
        setIsLoadingEntry(true);
        try {
          const entry = await getSingleEntry(id);
          if (entry) {
            setTitle(entry.title);
            setContent(entry.content);
            setMood(entry.mood as MoodType);
            setAiAnalysis(entry.aiAnalysis || '');
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoadingEntry(false);
        }
      } else if (promptText) {
        setTitle('Reflection on Daily Prompt');
        setContent(`Prompt: ${promptText}\n\n`);
      }
    };

    fetchEntry();
  }, [id, promptText]);

  const wordCount = useMemo(() => {
    return content.trim() ? content.trim().split(/\s+/).length : 0;
  }, [content]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please provide both a title and some content.');
      return;
    }

    setIsSaving(true);
    try {
      const entry: JournalEntry = {
        id: id || crypto.randomUUID(),
        userId: user.id,
        title: title.trim(),
        content: content.trim(),
        mood,
        date: id ? (await getSingleEntry(id))?.date || Date.now() : Date.now(),
        aiAnalysis,
        tags: []
      };

      await saveEntry(entry);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert("Failed to save entry. Please check your connection.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAIAnalyze = async () => {
    if (content.length < 50) {
      alert('Write at least 50 characters to get a meaningful AI reflection.');
      return;
    }
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeJournalEntry(content);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoadingEntry) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <div className="w-16 h-16 border-8 border-black border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black uppercase tracking-widest text-xl">Opening your journal...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-32 animate-in slide-in-from-bottom-4 duration-500">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 sticky top-24 bg-white/80 backdrop-blur-md py-4 z-40 border-b-2 border-black/5">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 font-black uppercase tracking-wider text-sm hover:translate-x-1 transition-transform"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Library
        </button>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Status</span>
            <span className="text-xs font-bold text-green-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Ready to save
            </span>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-black hover:bg-slate-800 disabled:bg-slate-200 text-white px-10 py-4 rounded-2xl font-black text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 transition-all flex items-center gap-3"
          >
            {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
            {id ? 'Update' : 'Commit to Paper'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Editor */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] min-h-[600px] flex flex-col">
            <input
              type="text"
              placeholder="Give your thoughts a name..."
              className="w-full text-5xl font-black text-black bg-transparent border-none focus:ring-0 placeholder:text-slate-200 mb-8 uppercase tracking-tighter"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            
            <textarea
              placeholder="Let your mind wander onto the page..."
              className="w-full flex-grow text-xl text-black font-medium leading-relaxed bg-transparent border-none focus:ring-0 resize-none placeholder:text-slate-200"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className="mt-8 pt-6 border-t-2 border-black/5 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-black/40">
              <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Word Count: {wordCount}</span>
              <span>Draft saved locally</span>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-8">
          {/* Date & Info */}
          <div className="bg-white p-6 rounded-[2rem] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-50 border-2 border-black rounded-2xl flex items-center justify-center">
              <Calendar className="w-7 h-7 text-black" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-black/40">Timestamp</p>
              <p className="text-sm font-black text-black">
                {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Mood Selector */}
          <div className="bg-white p-8 rounded-[2.5rem] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h4 className="text-xs font-black uppercase tracking-widest text-black mb-6 flex items-center gap-2">
              <Smile className="w-4 h-4" /> Current Mood
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {MOODS.map((m) => (
                <button
                  key={m.type}
                  onClick={() => setMood(m.type as MoodType)}
                  className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs font-black border-2 transition-all ${
                    mood === m.type 
                      ? `bg-black text-white border-black scale-105 shadow-lg` 
                      : 'bg-white border-slate-200 text-black hover:border-black'
                  }`}
                >
                  <span className="text-lg">{m.icon}</span>
                  {m.type}
                </button>
              ))}
            </div>
          </div>

          {/* AI Feedback */}
          <div className="bg-black text-white p-8 rounded-[2.5rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white" /> AI Reflection
              </h4>
              <button 
                onClick={handleAIAnalyze}
                disabled={isAnalyzing || content.length < 50}
                className="text-[10px] bg-white text-black px-4 py-2 rounded-full font-black hover:bg-slate-200 transition-all flex items-center gap-2 disabled:opacity-30"
              >
                {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Analyze
              </button>
            </div>
            
            {aiAnalysis ? (
              <div className="relative">
                <Quote className="absolute -top-2 -left-2 w-6 h-6 opacity-20" />
                <p className="text-white/90 font-bold leading-relaxed italic text-sm pl-4">
                  {aiAnalysis}
                </p>
              </div>
            ) : (
              <p className="text-white/40 text-sm font-bold leading-relaxed">
                Reflecting on your entry can reveal patterns in your journey. Tap analyze for insights.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryEditorPage;
