
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, PenTool, Brain, ShieldCheck, ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center bg-white text-black">
      <section className="text-center py-16 md:py-24 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black mb-8 border border-black">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-semibold uppercase tracking-wider">AI-Powered Reflection</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-black mb-6 leading-tight">
          Your thoughts, <br />
          <span className="underline decoration-indigo-500 underline-offset-8">beautifully captured.</span>
        </h1>
        <p className="text-xl text-black/80 mb-10 px-4 font-medium">
          Lumina is more than a journal. It's your companion for mindfulness, growth, and creative expression.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/auth" 
            className="group bg-black hover:bg-slate-800 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
          >
            Start Your Journey 
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="bg-white border-2 border-black hover:bg-slate-50 text-black px-8 py-4 rounded-2xl text-lg font-bold transition-all">
            See How It Works
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16 w-full">
        <div className="bg-white p-8 rounded-3xl border border-black shadow-sm hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center mb-6">
            <PenTool className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-3">Daily Inspiration</h3>
          <p className="text-black/70 font-medium">Never face a blank page. Gemini AI generates fresh, thought-provoking prompts every single day.</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-black shadow-sm hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center mb-6">
            <Brain className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-3">Smart Reflection</h3>
          <p className="text-black/70 font-medium">Receive supportive feedback and insights on your entries from our compassionate AI assistant.</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-black shadow-sm hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-3">Private & Secure</h3>
          <p className="text-black/70 font-medium">Your data is stored securely. Your journals are your sanctuary, always protected and private.</p>
        </div>
      </section>

      <section className="w-full bg-white border-4 border-black rounded-[3rem] p-12 md:p-20 text-center text-black mt-16 shadow-2xl relative overflow-hidden">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Transform your daily routine.</h2>
        <p className="text-black/80 text-lg mb-10 max-w-xl mx-auto font-medium">
          Join thousands of writers who have found their voice with Lumina's intuitive interface and gentle AI guidance.
        </p>
        <Link 
          to="/auth" 
          className="bg-black text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-colors shadow-lg"
        >
          Get Started for Free
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;
