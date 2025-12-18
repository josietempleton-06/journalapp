
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Book, Loader2, ShieldCheck } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      } else {
        if (!name || !email || !password) {
          setError('Please fill in all fields.');
          setIsLoading(false);
          return;
        }
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });
        if (signUpError) throw signUpError;
        
        // If user is returned and session is active, go to dashboard
        if (data?.session) {
           navigate('/dashboard');
           return;
        }
        
        alert('Verification email sent! Please check your inbox to confirm your account.');
        setIsLogin(true);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-20 animate-in fade-in zoom-in duration-500">
      <div className="bg-white p-12 rounded-[3rem] shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] border-4 border-black w-full max-w-lg">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-black rounded-[2rem] flex items-center justify-center text-white shadow-xl mx-auto mb-8 transform -rotate-3 hover:rotate-0 transition-transform cursor-pointer">
            <Book className="w-10 h-10" />
          </div>
          <h2 className="text-4xl font-black text-black uppercase tracking-tight mb-3">
            {isLogin ? 'Sign In to Lumina' : 'Join the Sanctuary'}
          </h2>
          <p className="text-black/50 font-bold text-lg">
            {isLogin ? 'Continue your journey of self-discovery.' : 'Start capturing your daily sparks.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-black/30 group-focus-within:text-black transition-colors" />
              <input
                type="text"
                placeholder="What should we call you?"
                className="w-full pl-14 pr-6 py-5 bg-white border-2 border-black rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all font-bold"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}
          <div className="relative group">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-black/30 group-focus-within:text-black transition-colors" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-14 pr-6 py-5 bg-white border-2 border-black rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all font-bold"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="relative group">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-black/30 group-focus-within:text-black transition-colors" />
            <input
              type="password"
              placeholder="Your Secret Password"
              className="w-full pl-14 pr-6 py-5 bg-white border-2 border-black rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all font-bold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-rose-50 border-2 border-rose-600 p-4 rounded-xl flex items-center gap-3">
              <span className="text-rose-600 font-black text-sm">{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-black hover:bg-slate-800 disabled:bg-slate-300 text-white py-5 rounded-[2rem] font-black text-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-3 group"
          >
            {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : (
              <>
                {isLogin ? 'Sign In' : 'Sign Up'}
                <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 flex flex-col items-center gap-6">
          <p className="text-black font-bold">
            {isLogin ? "New to the journal?" : "Already a member?"}{' '}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-black font-black underline decoration-4 hover:bg-black hover:text-white px-2 transition-all"
              disabled={isLoading}
            >
              {isLogin ? 'Create Account' : 'Sign In instead'}
            </button>
          </p>
          <div className="flex items-center gap-2 text-black/30 font-black text-[10px] uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" /> Secure Auth by Supabase
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
