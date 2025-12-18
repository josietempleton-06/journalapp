
import React from 'react';
import { Smile, Coffee, CloudRain, Zap, Heart, Moon, Sunset } from 'lucide-react';

export const MOODS = [
  { type: 'Happy', icon: <Smile className="w-5 h-5" />, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { type: 'Calm', icon: <Sunset className="w-5 h-5" />, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { type: 'Sad', icon: <CloudRain className="w-5 h-5" />, color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { type: 'Anxious', icon: <Zap className="w-5 h-5" />, color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { type: 'Energized', icon: <Zap className="w-5 h-5" />, color: 'bg-green-100 text-green-700 border-green-200' },
  { type: 'Tired', icon: <Moon className="w-5 h-5" />, color: 'bg-slate-100 text-slate-700 border-slate-200' },
  { type: 'Grateful', icon: <Heart className="w-5 h-5" />, color: 'bg-pink-100 text-pink-700 border-pink-200' },
];

export const APP_THEME = {
  primary: 'indigo-600',
  secondary: 'teal-500',
  accent: 'rose-400',
  bgGradient: 'from-indigo-50 via-white to-teal-50'
};
