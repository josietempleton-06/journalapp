
import { JournalEntry } from '../types';
import { supabase } from './supabaseClient';

export const getStoredEntries = async (userId: string): Promise<JournalEntry[]> => {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching entries:', error);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    userId: item.user_id,
    title: item.title,
    content: item.content,
    mood: item.mood,
    date: new Date(item.date).getTime(),
    aiAnalysis: item.ai_analysis,
    tags: item.tags || []
  }));
};

export const saveEntry = async (entry: JournalEntry) => {
  const payload = {
    id: entry.id,
    user_id: entry.userId,
    title: entry.title,
    content: entry.content,
    mood: entry.mood,
    date: new Date(entry.date).toISOString(),
    ai_analysis: entry.aiAnalysis,
    tags: entry.tags
  };

  const { error } = await supabase
    .from('entries')
    .upsert(payload, { onConflict: 'id' });

  if (error) {
    console.error('Error saving entry:', error);
    throw error;
  }
};

export const deleteEntry = async (entryId: string) => {
  const { error } = await supabase
    .from('entries')
    .delete()
    .eq('id', entryId);

  if (error) {
    console.error('Error deleting entry:', error);
    throw error;
  }
};

export const getSingleEntry = async (entryId: string): Promise<JournalEntry | null> => {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('id', entryId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    content: data.content,
    mood: data.mood,
    date: new Date(data.date).getTime(),
    aiAnalysis: data.ai_analysis,
    tags: data.tags || []
  };
};
