import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/login', { email, password });
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center animate-fade-in-up">
      <div className="w-full max-w-[420px] bg-white/70 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgb(0,0,0,0.05)] border border-white">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Welcome Back</h2>
          <p className="text-slate-500 font-medium">Enter your credentials to access your account.</p>
        </div>
        
        {error && <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl mb-6 text-sm font-bold border border-rose-100 animate-pulse">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
            <input type="email" required className="w-full bg-slate-50/50 border-slate-200 rounded-2xl p-4 border focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium" 
              placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <input type="password" required className="w-full bg-slate-50/50 border-slate-200 rounded-2xl p-4 border focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium" 
              placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          
          <button disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold tracking-wide py-4 rounded-2xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-[0.98] mt-4 disabled:opacity-70 flex justify-center items-center">
            {loading ? <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Sign In'}
          </button>
        </form>
        
        <p className="mt-8 text-center text-slate-500 font-medium">
          New to Eventify? <Link to="/signup" className="text-indigo-600 font-bold hover:underline hover:text-indigo-700">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
