
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Book, LogOut, Plus, User } from 'lucide-react';
import { User as UserType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: UserType | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const navigate = useNavigate();

  // Fix: Removed setSession as it was not exported from dbService and isn't needed with Supabase auth
  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-black px-4 md:px-8 py-4 flex items-center justify-between">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
            <Book className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-black hidden sm:block">Lumina</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link 
                to="/new" 
                className="flex items-center gap-2 bg-black hover:bg-slate-800 text-white px-4 py-2 rounded-full transition-all shadow-md active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">New Entry</span>
              </Link>
              <div className="h-8 w-[1px] bg-slate-200 mx-2" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center text-black">
                  <User className="w-5 h-5" />
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-black hover:text-rose-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <Link 
              to="/auth" 
              className="bg-black hover:bg-slate-800 text-white px-6 py-2 rounded-full transition-all shadow-lg active:scale-95 font-semibold"
            >
              Get Started
            </Link>
          )}
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 md:px-8 py-8 max-w-6xl">
        {children}
      </main>

      <footer className="py-8 border-t border-black text-center text-black text-sm font-medium">
        <p>© 2024 Lumina Journal. Spark your creativity daily.</p>
      </footer>
    </div>
  );
};

export default Layout;
