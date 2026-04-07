import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function BookingForm() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [requirements, setRequirements] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
       navigate('/login');
       return;
    }
    axios.get(`http://localhost:8000/events/${id}`)
      .then(res => setEvent(res.data))
      .catch(err => console.error(err));
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`http://localhost:8000/bookings?user_id=${user.id}`, {
        event_id: event.id,
        date: date,
        time: time,
        custom_requirements: requirements
      });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error(err);
      alert('Failed to book event.');
      setLoading(false);
    }
  };

  if (!event) return <div className="text-center py-32 text-slate-400 font-bold animate-pulse text-xl">Loading...</div>;

  if (success) {
    return (
      <div className="max-w-lg mx-auto bg-white/80 backdrop-blur-xl p-16 rounded-[3rem] shadow-[0_20px_50px_rgb(0,0,0,0.05)] border border-white text-center animate-fade-in text-slate-900 mt-10">
        <CheckCircle2 size={80} className="mx-auto text-emerald-500 mb-6" />
        <h2 className="text-4xl font-black tracking-tight mb-4">Spot Secured!</h2>
        <p className="text-slate-500 text-lg font-medium">You're going to <strong className="text-slate-900">{event.title}</strong>.</p>
        <p className="text-slate-400 mt-2">Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up mt-8">
      <Link to={`/event/${event.id}`} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-6 transition-colors">
        <ArrowLeft size={20} /> Back to Details
      </Link>
      
      <div className="bg-white/80 backdrop-blur-xl p-10 md:p-14 rounded-[3rem] shadow-[0_20px_50px_rgb(0,0,0,0.03)] border border-white">
        <div className="mb-10 text-center">
          <span className="text-indigo-600 font-black uppercase tracking-widest text-sm mb-2 block object-left">Reservation</span>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-4">{event.title}</h2>
          <div className="inline-block bg-slate-50 border border-slate-100 rounded-full px-6 py-2 text-slate-500 font-medium">
            Total Price: <strong className="text-slate-900 mx-1">{event.price === 0 ? "Free" : `₹${event.price.toLocaleString()}`}</strong>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Date</label>
              <input type="date" required className="w-full bg-slate-50/50 border-slate-200 rounded-2xl p-4 border focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-900" 
                value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Arrival Time</label>
              <input type="time" required className="w-full bg-slate-50/50 border-slate-200 rounded-2xl p-4 border focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-900" 
                value={time} onChange={e => setTime(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Special Requests <span className="text-slate-400 font-normal">(Optional)</span></label>
            <textarea rows="4" className="w-full bg-slate-50/50 border-slate-200 rounded-2xl p-4 border focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-900 resize-none" 
              placeholder="e.g., VIP parking, dietry restrictions..."
              value={requirements} onChange={e => setRequirements(e.target.value)} />
          </div>
          
          <div className="pt-4">
             <button disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold tracking-wide py-4 md:py-5 rounded-2xl hover:shadow-xl hover:shadow-indigo-500/30 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center text-lg">
              {loading ? <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Confirm Reservation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
