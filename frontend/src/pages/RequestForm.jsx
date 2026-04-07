import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function RequestForm() {
  const { id } = useParams();
  const [manager, setManager] = useState(null);
  const [formData, setFormData] = useState({ event_type: '', date: '', budget: '', special_requirements: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
       navigate('/login');
       return;
    }
    axios.get(`http://localhost:8000/managers`)
      .then(res => {
        const mgr = res.data.find(m => m.id === parseInt(id));
        setManager(mgr);
      })
      .catch(err => console.error(err));
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`http://localhost:8000/event-requests?client_id=${user.id}`, {
        manager_id: parseInt(id),
        event_type: formData.event_type,
        date: formData.date,
        budget: parseFloat(formData.budget),
        special_requirements: formData.special_requirements
      });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error(err);
      alert('Failed to submit request.');
      setLoading(false);
    }
  };

  if (!manager) return <div className="text-center py-32 text-slate-400 font-bold animate-pulse text-xl">Loading...</div>;

  if (success) {
    return (
      <div className="max-w-lg mx-auto bg-white/80 backdrop-blur-xl p-16 rounded-[3rem] shadow-[0_20px_50px_rgb(0,0,0,0.05)] border border-white text-center animate-fade-in text-slate-900 mt-10">
        <CheckCircle2 size={80} className="mx-auto text-emerald-500 mb-6" />
        <h2 className="text-4xl font-black tracking-tight mb-4">Request Sent!</h2>
        <p className="text-slate-500 text-lg font-medium">Your request goes straight to <strong className="text-slate-900">{manager.manager_profile.business_name}</strong>.</p>
        <p className="text-slate-400 mt-2">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up mt-8">
      <Link to={`/manager/${manager.id}`} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-6 transition-colors">
        <ArrowLeft size={20} /> Back to Profile
      </Link>
      
      <div className="bg-white/80 backdrop-blur-xl p-10 md:p-14 rounded-[3rem] shadow-[0_20px_50px_rgb(0,0,0,0.03)] border border-white">
        <div className="mb-10 text-center">
          <span className="text-indigo-600 font-black uppercase tracking-widest text-sm mb-2 block object-left">Event Proposal</span>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-4">Request Services</h2>
          <p className="text-slate-500 font-medium tracking-wide">
             Reaching out to <strong className="text-indigo-600">{manager.manager_profile.business_name}</strong>
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Style of Event</label>
              <input type="text" placeholder="e.g. Wedding, Birthday" required className="w-full bg-slate-50/50 border-slate-200 rounded-2xl p-4 border focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-900" 
                value={formData.event_type} onChange={e => setFormData({...formData, event_type: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Estimated Date</label>
              <input type="date" required className="w-full bg-slate-50/50 border-slate-200 rounded-2xl p-4 border focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-900" 
                value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Your Budget Limit (₹)</label>
            <input type="number" required placeholder="50000" className="w-full bg-slate-50/50 border-slate-200 rounded-2xl p-4 border focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-900" 
              value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Vision & Details</label>
            <textarea rows="4" className="w-full bg-slate-50/50 border-slate-200 rounded-2xl p-4 border focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-900 resize-none placeholder-slate-400" 
              placeholder="Tell them about your venue, guest count, and overall vibe..."
              value={formData.special_requirements} onChange={e => setFormData({...formData, special_requirements: e.target.value})} />
          </div>
          
          <div className="pt-4">
             <button disabled={loading} className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold tracking-wide py-4 md:py-5 rounded-2xl hover:shadow-xl hover:shadow-slate-500/30 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center text-lg">
              {loading ? <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Send Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
