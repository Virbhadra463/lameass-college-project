import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Signup() {
  const [role, setRole] = useState('client');
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '' });
  const [managerData, setManagerData] = useState({ business_name: '', event_types: '', description: '', min_price: '', image_url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        role: role,
        manager_profile: role === 'manager' ? {
           ...managerData,
           min_price: parseFloat(managerData.min_price) || 0
        } : null
      };
      
      const res = await axios.post('http://localhost:8000/signup', payload);
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-in-up py-10">
      <div className="w-full max-w-[480px] bg-white/70 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgb(0,0,0,0.05)] border border-white">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Create Account</h2>
          <p className="text-slate-500 font-medium">Join us to plan or manage incredible events.</p>
        </div>
        
        {/* Role Selector */}
        <div className="flex bg-slate-100 rounded-2xl p-1.5 mb-8">
           <button onClick={() => setRole('client')} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${role === 'client' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>I am looking to Host</button>
           <button onClick={() => setRole('manager')} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${role === 'manager' ? 'bg-white shadow-sm text-fuchsia-600' : 'text-slate-500 hover:text-slate-700'}`}>I am an Event Manager</button>
        </div>
        
        {error && <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl mb-6 text-sm font-bold border border-rose-100 animate-pulse">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name / Contact Name</label>
            <input type="text" required className="w-full bg-slate-50/50 border-slate-200 rounded-2xl p-4 border focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium" 
              placeholder="John Doe" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
            <input type="email" required className="w-full bg-slate-50/50 border-slate-200 rounded-2xl p-4 border focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium" 
              placeholder="you@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <input type="password" required className="w-full bg-slate-50/50 border-slate-200 rounded-2xl p-4 border focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium" 
              placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          
          {role === 'manager' && (
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="font-bold text-slate-900 mb-2">Manager Profile Info</h3>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Agency / Business Name</label>
                <input type="text" required className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 border outline-none font-medium text-sm" 
                  value={managerData.business_name} onChange={e => setManagerData({...managerData, business_name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Specialized Events (comma separated)</label>
                <input type="text" required placeholder="e.g. Wedding, Corporate, Birthday" className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 border outline-none font-medium text-sm" 
                  value={managerData.event_types} onChange={e => setManagerData({...managerData, event_types: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Starting Price (Minimum Budget)</label>
                <input type="number" required placeholder="10000" className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 border outline-none font-medium text-sm" 
                  value={managerData.min_price} onChange={e => setManagerData({...managerData, min_price: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Short Description</label>
                <input type="text" required placeholder="We make your dreams come true..." className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 border outline-none font-medium text-sm" 
                  value={managerData.description} onChange={e => setManagerData({...managerData, description: e.target.value})} />
              </div>
            </div>
          )}
          
          <button disabled={loading} className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold tracking-wide py-4 rounded-2xl hover:shadow-xl hover:shadow-slate-500/30 transition-all active:scale-[0.98] mt-6 disabled:opacity-70 flex justify-center items-center">
            {loading ? <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Create Profile'}
          </button>
        </form>
        
        <p className="mt-8 text-center text-slate-500 font-medium">
           Already have an account? <Link to="/login" className="text-slate-900 font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
