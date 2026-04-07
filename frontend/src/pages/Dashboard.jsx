import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Compass, CalendarDays, Ticket } from 'lucide-react';

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    axios.get(`http://localhost:8000/bookings?user_id=${user.id}`)
      .then(res => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch bookings", err);
        setLoading(false);
      });
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      {/* Header Stat Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-10 md:p-14 mb-10 shadow-2xl shadow-slate-900/20 flex flex-col md:flex-row items-start md:items-center justify-between text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-2">Welcome Back</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-white">{user.full_name}</h1>
          <p className="text-slate-300 font-medium">Ready for your next experience?</p>
        </div>
        <div className="mt-8 md:mt-0 relative z-10 bg-white/10 backdrop-blur-md border border-white/10 px-8 py-6 rounded-3xl flex items-center gap-6">
          <div className="bg-indigo-500/20 p-4 rounded-2xl text-indigo-300">
             <Ticket size={32} />
          </div>
          <div>
             <p className="text-slate-300 text-sm font-bold uppercase tracking-widest mb-1">Your Tickets</p>
             <p className="text-4xl font-black">{bookings.length}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8 px-2">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Reservations</h2>
      </div>
      
      {loading ? (
        <div className="text-center py-20 text-slate-400 font-bold tracking-widest animate-pulse uppercase">Syncing records...</div>
      ) : bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group relative overflow-hidden">
               {/* Status Badge */}
               <div className="absolute top-6 right-6">
                 <span className="bg-emerald-50 text-emerald-600 border border-emerald-100/50 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
                   {b.status}
                 </span>
               </div>
               
               <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden mb-6 flex-shrink-0 relative group-hover:scale-105 transition-transform">
                 <img src={b.event.image_url} className="w-full h-full object-cover" alt="Thumb"/>
               </div>
               
               <div className="mb-6">
                 <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">{b.event.title}</h3>
                 <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{b.event.category}</span>
               </div>
               
               <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
                 <div className="flex items-center gap-3 mb-3 text-slate-600">
                    <CalendarDays size={18} className="text-indigo-400" />
                    <span className="font-medium text-sm">{b.date}</span>
                 </div>
                 <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-4 h-4 rounded-full border-[3px] border-indigo-400/30 flex items-center justify-center ml-[2px]">
                       <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
                    </div>
                    <span className="font-medium text-sm ml-[1px]">{b.time}</span>
                 </div>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] border border-dashed border-slate-300 p-16 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
            <Compass size={32} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">No upcoming plans</h3>
          <p className="text-slate-500 font-medium mb-8 text-lg">Your itinerary is completely empty. Time to discover something new.</p>
          <button onClick={() => navigate('/')} className="bg-slate-900 text-white font-bold tracking-wide px-8 py-3.5 rounded-full hover:shadow-xl hover:shadow-slate-900/20 hover:-translate-y-1 transition-all">
            Start Exploring
          </button>
        </div>
      )}
    </div>
  );
}
