import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { MapPin, Users, Calendar, ArrowLeft } from 'lucide-react';

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8000/events/${id}`)
      .then(res => setEvent(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!event) return <div className="text-center py-32 text-slate-400 font-bold animate-pulse text-xl tracking-tight">Loading experience...</div>;

  return (
    <div className="max-w-5xl mx-auto animate-fade-in-up mt-4">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-6 transition-colors">
        <ArrowLeft size={20} /> Back to Events
      </Link>
      
      <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgb(0,0,0,0.03)] border border-white overflow-hidden flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-1/2 relative bg-slate-100">
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 to-transparent z-10"></div>
          <img src={event.image_url} alt={event.title} className="w-full h-[400px] md:h-full object-cover" />
          <div className="absolute bottom-8 left-8 z-20">
             <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl">
               {event.category}
             </span>
          </div>
        </div>
        
        {/* Details Section */}
        <div className="md:w-1/2 p-10 md:p-14 flex flex-col justify-center relative">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">{event.title}</h1>
          <p className="text-slate-500 text-lg md:text-xl leading-relaxed mb-10 font-medium">{event.description}</p>
          
          <div className="grid grid-cols-2 gap-6 mb-12">
             <div className="flex items-center gap-3 text-slate-600 font-medium">
               <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600"><MapPin size={22} /></div>
               Premium Venue
             </div>
             <div className="flex items-center gap-3 text-slate-600 font-medium">
               <div className="bg-fuchsia-50 p-3 rounded-xl text-fuchsia-600"><Users size={22} /></div>
               Limited Spots
             </div>
          </div>
          
          <div className="bg-slate-50/50 border border-slate-100 rounded-[2rem] p-8 flex flex-col sm:flex-row justify-between items-center mt-auto">
            <div className="mb-6 sm:mb-0 text-center sm:text-left">
              <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-1">Entry Pass</p>
              <p className="text-4xl font-black text-slate-900 tracking-tight">
                 {event.price === 0 ? "Free" : `₹${event.price.toLocaleString()}`}
              </p>
            </div>
            <button 
              onClick={() => user ? navigate(`/book/${event.id}`) : navigate('/login')}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold tracking-wide py-4 px-10 rounded-2xl hover:shadow-xl hover:shadow-indigo-500/30 transition-all active:scale-[0.97]"
            >
              {user ? 'Secure Spot' : 'Login to Proceed'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
