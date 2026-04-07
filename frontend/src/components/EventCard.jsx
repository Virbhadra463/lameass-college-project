import React from 'react';
import { Link } from 'react-router-dom';

export default function EventCard({ event }) {
  return (
    <div className="group bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col h-full border border-slate-200/60 relative">
      <div className="absolute top-4 right-4 z-10 bg-black/30 backdrop-blur-md text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded-full tracking-widest border border-white/10">
        {event.category}
      </div>
      
      <div className="overflow-hidden h-56 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent z-0"></div>
        <img 
          src={event.image_url} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" 
        />
      </div>
      
      <div className="p-6 flex flex-col flex-grow bg-white z-10 -mt-4 rounded-t-3xl relative">
        <h3 className="text-xl font-bold text-slate-900 line-clamp-1 mb-2 tracking-tight group-hover:text-indigo-600 transition-colors">{event.title}</h3>
        <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">{event.description}</p>
        
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100">
          <span className="font-extrabold text-slate-900 text-lg">
            {event.price === 0 ? "Free" : `₹${event.price.toLocaleString()}`}
          </span>
          <Link to={`/event/${event.id}`} className="text-sm border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-600 px-4 py-2 rounded-xl font-bold transition-all duration-300 shadow-sm hover:shadow-md bg-white">
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}
