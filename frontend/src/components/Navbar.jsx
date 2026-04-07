import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CalendarDays, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="sticky top-0 z-50 px-4 pt-4 pb-2">
      <nav className="container mx-auto bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl px-6 py-4 flex justify-between items-center transition-all">
        <Link to="/" className="text-2xl font-black tracking-tight flex items-center gap-2 text-slate-800 hover:text-indigo-600 transition-colors">
          <div className="bg-indigo-600 text-white p-1.5 rounded-xl shadow-md shadow-indigo-200">
            <CalendarDays size={20} strokeWidth={2.5} />
          </div>
          Eventify
        </Link>
        <div className="flex gap-5 items-center font-semibold text-sm">
          {user ? (
            <>
              <Link to="/dashboard" className={`flex items-center gap-1.5 transition-colors ${location.pathname === '/dashboard' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}>
                <User size={18} strokeWidth={2.5} /> Dashboard
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-1.5 text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors">
                <LogOut size={16} strokeWidth={2.5} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-500 hover:text-slate-800 transition-colors">Log In</Link>
              <Link to="/signup" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">Start Exploring</Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
