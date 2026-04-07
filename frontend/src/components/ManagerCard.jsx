import React from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';

export default function ManagerCard({ manager }) {
  const profile = manager.manager_profile;
  if (!profile) return null;

  return (
    <div className="group bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col h-full border border-slate-200/60 relative">
      <div className="overflow-hidden h-56 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-0"></div>
        <img 
          src={profile.image_url} 
          alt={profile.business_name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" 
        />
        <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-2">
            {profile.event_types.split(',').slice(0, 2).map((cat, i) => (
                <span key={i} className="bg-white/20 backdrop-blur-md text-white border border-white/20 text-[10px] uppercase font-bold px-3 py-1 rounded-full tracking-widest shadow-sm">
                   {cat.trim()}
                </span>
            ))}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow bg-white z-10 -mt-2 rounded-t-3xl relative">
        <h3 className="text-xl font-black text-slate-900 line-clamp-1 mb-1 tracking-tight group-hover:text-indigo-600 transition-colors">{profile.business_name}</h3>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">Managed by {manager.full_name}</p>
        <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">{profile.description}</p>
        
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Starts at</span>
            <span className="font-extrabold text-slate-900 text-lg">
              ₹{profile.min_price.toLocaleString()}
            </span>
          </div>
          <Link to={`/manager/${manager.id}`} className="text-sm bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
            Hire
          </Link>
        </div>
      </div>
    </div>
  );
}
