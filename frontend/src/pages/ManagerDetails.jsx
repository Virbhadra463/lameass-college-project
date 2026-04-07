import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, CheckCircle2, Ticket, Briefcase } from 'lucide-react';

export default function ManagerDetails() {
  const { id } = useParams(); // this is the user.id of the manager
  const [manager, setManager] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Need to fetch manager specifically, or from the manager list
    axios.get(`http://localhost:8000/managers`)
      .then(res => {
        const mgr = res.data.find(m => m.id === parseInt(id));
        setManager(mgr);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (!manager) return <div className="text-center py-32 text-slate-400 font-bold animate-pulse text-xl tracking-tight">Loading profile...</div>;
  const profile = manager.manager_profile;
  const isManagerSelf = user && user.id === manager.id;

  return (
    <div className="max-w-5xl mx-auto animate-fade-in-up mt-4">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-6 transition-colors">
        <ArrowLeft size={20} /> Back to Search
      </Link>
      
      <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgb(0,0,0,0.03)] border border-white overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 relative bg-slate-100">
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 to-transparent z-10"></div>
          <img src={profile.image_url} alt={profile.business_name} className="w-full h-[400px] md:h-full object-cover" />
          <div className="absolute bottom-8 left-8 z-20 flex flex-wrap gap-2">
             {profile.event_types.split(',').map((cat, i) => (
                <span key={i} className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl">
                  {cat.trim()}
                </span>
             ))}
          </div>
        </div>
        
        <div className="md:w-1/2 p-10 md:p-14 flex flex-col justify-center relative">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-2">{profile.business_name}</h1>
          <p className="text-indigo-600 font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
             <Briefcase size={16}/> Managed by {manager.full_name}
          </p>
          <p className="text-slate-500 text-lg leading-relaxed mb-10 font-medium">{profile.description}</p>
          
          <div className="bg-slate-50/50 border border-slate-100 rounded-[2rem] p-8 flex flex-col sm:flex-row justify-between items-center mt-auto">
            <div className="mb-6 sm:mb-0 text-center sm:text-left">
              <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-1">Budget Starts At</p>
              <p className="text-4xl font-black text-slate-900 tracking-tight">
                 ₹{profile.min_price.toLocaleString()}
              </p>
            </div>
            {!isManagerSelf ? (
              <button 
                onClick={() => user ? navigate(`/request/${manager.id}`) : navigate('/login')}
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold tracking-wide py-4 px-10 rounded-2xl hover:shadow-xl hover:shadow-indigo-500/30 transition-all active:scale-[0.97]"
              >
                {user ? 'Request Booking' : 'Login to Proceed'}
              </button>
            ) : (
               <div className="bg-slate-200 text-slate-600 font-bold px-6 py-3 rounded-2xl">Your Profile</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
