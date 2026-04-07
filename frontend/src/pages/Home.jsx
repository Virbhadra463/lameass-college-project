import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ManagerCard from '../components/ManagerCard';
import FindPlannerModal from '../components/FindPlannerModal';
import { ArrowRight, Sparkles, Search, Star, Shield, Clock, Heart, ChevronDown } from 'lucide-react';

const STATS = [
  { value: '500+', label: 'Events Delivered' },
  { value: '12+', label: 'Cities Covered' },
  { value: '50+', label: 'Expert Planners' },
  { value: '4.9★', label: 'Avg. Rating' },
];

const CATEGORIES = [
  { icon: '💍', label: 'Weddings', color: 'bg-pink-50 border-pink-100 text-pink-700' },
  { icon: '🎂', label: 'Birthdays', color: 'bg-amber-50 border-amber-100 text-amber-700' },
  { icon: '🥂', label: 'Receptions', color: 'bg-violet-50 border-violet-100 text-violet-700' },
  { icon: '💼', label: 'Corporate', color: 'bg-blue-50 border-blue-100 text-blue-700' },
  { icon: '🎤', label: 'Sangeet', color: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
  { icon: '🎊', label: 'Parties', color: 'bg-rose-50 border-rose-100 text-rose-700' },
];

const WHY_US = [
  {
    icon: <Shield size={28} />,
    title: 'Verified Planners',
    desc: 'Every planner is vetted and reviewed by real clients across India.',
    color: 'text-indigo-500 bg-indigo-50',
  },
  {
    icon: <Clock size={28} />,
    title: 'Instant Matching',
    desc: 'Tell us your budget and event type — get matched in seconds.',
    color: 'text-emerald-500 bg-emerald-50',
  },
  {
    icon: <Heart size={28} />,
    title: 'Made for India',
    desc: 'From Rajasthani weddings to Mumbai office parties — we know Indian events.',
    color: 'text-rose-500 bg-rose-50',
  },
  {
    icon: <Star size={28} />,
    title: 'Budget Friendly',
    desc: 'Options starting from ₹12,000. Premium quality at every price point.',
    color: 'text-amber-500 bg-amber-50',
  },
];

export default function Home() {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8000/managers')
      .then(res => {
        setManagers(res.data);
        setTimeout(() => setLoading(false), 300);
      })
      .catch(err => {
        console.error("Failed to fetch managers", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="animate-fade-in-up">

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  HERO SECTION                                          */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="relative mb-20 text-center rounded-[3rem] px-8 py-28 overflow-hidden shadow-sm flex flex-col items-center justify-center border border-indigo-50 bg-indigo-50/50">
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-200 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-200 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2 opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-100 rounded-full blur-[120px] -z-10 opacity-40"></div>
        
        <span className="bg-white/80 border border-indigo-200 text-indigo-700 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2 shadow-sm backdrop-blur-md">
          <Sparkles size={14} /> India's #1 Event Planning Platform
        </span>

        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-slate-900 max-w-5xl leading-[1.05]">
          Your dream event, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-500">planned to perfection.</span>
        </h1>

        <p className="text-slate-600 max-w-2xl mx-auto text-xl font-medium mb-10 leading-relaxed">
          From lavish weddings in Udaipur to birthday bashes in Mumbai — discover India's finest event planners, matched perfectly to your budget and vision.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-14">
          <button
            onClick={() => setShowModal(true)}
            className="group bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-bold px-10 py-4 text-lg rounded-2xl shadow-xl shadow-indigo-600/20 hover:shadow-2xl hover:shadow-fuchsia-600/30 transition-all hover:-translate-y-1 flex items-center gap-3"
          >
            <Search size={20} /> Find My Planner <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => document.getElementById('planners-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="group bg-white text-slate-700 font-bold px-10 py-4 text-lg rounded-2xl border-2 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-all hover:-translate-y-1 flex items-center gap-3"
          >
            Browse All <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{s.value}</p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-300 animate-bounce">
          <ChevronDown size={24} />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  EVENT CATEGORIES SECTION                              */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="mb-20">
        <div className="text-center mb-10">
          <span className="text-indigo-600 font-black uppercase tracking-widest text-xs mb-2 block">What are you planning?</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Every occasion, covered</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, i) => (
            <button
              key={i}
              onClick={() => setShowModal(true)}
              className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 ${cat.color} hover:scale-[1.05] hover:shadow-lg transition-all duration-200`}
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-xs font-black tracking-wide">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  WHY CHOOSE US SECTION                                 */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="mb-20">
        <div className="text-center mb-10">
          <span className="text-indigo-600 font-black uppercase tracking-widest text-xs mb-2 block">Why Eventify</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">Built for Indian celebrations</h2>
          <p className="text-slate-500 font-medium text-lg max-w-xl mx-auto">We understand the colours, chaos, and charm of Indian events — and we make planning effortless.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_US.map((item, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-3xl p-8 text-center hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 ${item.color}`}>
                {item.icon}
              </div>
              <h3 className="font-black text-slate-900 text-lg mb-2 tracking-tight">{item.title}</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  HOW IT WORKS SECTION                                  */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="mb-20 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-10 md:p-16 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-fuchsia-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3"></div>

        <div className="text-center mb-12 relative z-10">
          <span className="text-indigo-400 font-black uppercase tracking-widest text-xs mb-2 block">Simple Process</span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">How It Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {[
            { step: '01', title: 'Tell Us Your Vision', desc: 'Choose event type, set your budget, pick a date — takes 30 seconds.', emoji: '✨' },
            { step: '02', title: 'Get Matched Instantly', desc: 'Our smart engine finds planners that fit your budget and style perfectly.', emoji: '🎯' },
            { step: '03', title: 'Book & Celebrate', desc: 'Connect with your planner, finalize details, and enjoy your perfect event.', emoji: '🎉' },
          ].map((s, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center relative">
              <span className="text-6xl mb-4 block">{s.emoji}</span>
              <span className="text-indigo-400 font-black text-sm tracking-widest mb-2 block">STEP {s.step}</span>
              <h3 className="text-xl font-black mb-2 tracking-tight">{s.title}</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 relative z-10">
          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-slate-900 font-bold px-10 py-4 text-lg rounded-2xl hover:shadow-xl hover:shadow-white/10 transition-all hover:-translate-y-1 inline-flex items-center gap-3"
          >
            <Search size={20} /> Get Started Now <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  FEATURED PLANNERS SECTION                             */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div id="planners-section" className="mb-16">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-end px-2 gap-4">
          <div>
            <span className="text-indigo-600 font-black uppercase tracking-widest text-xs mb-2 block">Handpicked for You</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Featured Event Planners</h2>
            <p className="text-slate-500 font-medium text-lg">Top-rated Indian planners verified by our community.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="text-sm bg-indigo-50 text-indigo-700 border border-indigo-100 px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-100 transition-colors flex items-center gap-2 flex-shrink-0"
          >
            <Search size={16} /> Smart Match
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(idx => (
             <div key={idx} className="bg-white border border-slate-100 animate-pulse h-[450px] rounded-[2.5rem] shadow-sm"></div>
            ))}
          </div>
        ) : managers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {managers.map((mgr) => (
               <ManagerCard key={mgr.id} manager={mgr} />
            ))}
          </div>
        ) : (
          <div className="text-center bg-white border border-slate-100 rounded-3xl py-20">
             <p className="text-slate-500 font-medium">No event managers found at the moment.</p>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  CTA BANNER                                            */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="mb-10 bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-500 rounded-[2.5rem] p-10 md:p-16 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDYwIEwgNjAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Ready to plan something amazing?</h2>
          <p className="text-white/80 text-lg font-medium mb-8 max-w-xl mx-auto">Join thousands of Indians who found their perfect event planner through Eventify.</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-slate-900 font-bold px-10 py-4 text-lg rounded-2xl hover:shadow-2xl hover:shadow-black/20 transition-all hover:-translate-y-1 inline-flex items-center gap-3"
          >
            <Sparkles size={20} /> Find My Planner
          </button>
        </div>
      </div>

      {/* Find Planner Modal */}
      <FindPlannerModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
