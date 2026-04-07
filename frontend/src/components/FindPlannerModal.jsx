import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { X, Search, Sparkles, CalendarDays, IndianRupee, Users, PartyPopper, ArrowRight, Loader2 } from 'lucide-react';

const EVENT_TYPES = [
  { label: 'Wedding', icon: '💍', color: 'from-pink-500 to-rose-500' },
  { label: 'Birthday', icon: '🎂', color: 'from-amber-500 to-orange-500' },
  { label: 'Corporate', icon: '💼', color: 'from-blue-500 to-indigo-500' },
  { label: 'Concert', icon: '🎵', color: 'from-purple-500 to-violet-500' },
  { label: 'Party', icon: '🎉', color: 'from-emerald-500 to-teal-500' },
  { label: 'Exhibition', icon: '🎨', color: 'from-cyan-500 to-sky-500' },
  { label: 'Retreat', icon: '🏕️', color: 'from-lime-500 to-green-500' },
];

const BUDGET_RANGES = [
  { label: 'Under ₹10K', value: 10000 },
  { label: '₹10K – ₹50K', value: 50000 },
  { label: '₹50K – ₹1L', value: 100000 },
  { label: '₹1L – ₹5L', value: 500000 },
  { label: '₹5L+', value: 1000000 },
];

export default function FindPlannerModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1: form, 2: results
  const [selectedType, setSelectedType] = useState('');
  const [budget, setBudget] = useState('');
  const [customBudget, setCustomBudget] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const resetAndClose = () => {
    setStep(1);
    setSelectedType('');
    setBudget('');
    setCustomBudget('');
    setGuestCount('');
    setDate('');
    setResults([]);
    onClose();
  };

  const handleSearch = async () => {
    setLoading(true);
    const finalBudget = customBudget ? parseFloat(customBudget) : (budget ? parseFloat(budget) : 0);
    try {
      const res = await axios.get('http://localhost:8000/managers/match', {
        params: {
          event_type: selectedType,
          budget: finalBudget,
        }
      });
      setResults(res.data);
      setStep(2);
    } catch (err) {
      console.error('Failed to match planners', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={resetAndClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl shadow-slate-900/20 border border-white/60 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-6 right-6 z-10 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 p-2.5 rounded-xl transition-all"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        {step === 1 ? (
          /* ─── Form Step ─── */
          <div className="p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-fuchsia-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-indigo-200/50">
                <Sparkles size={14} /> Smart Match
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
                Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">Perfect Planner</span>
              </h2>
              <p className="text-slate-500 font-medium">Tell us about your event and we'll match you with the best.</p>
            </div>

            {/* Event Type Selection */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <PartyPopper size={16} className="text-indigo-500" /> What type of event?
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {EVENT_TYPES.map((type) => (
                  <button
                    key={type.label}
                    onClick={() => setSelectedType(type.label)}
                    className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 transition-all duration-200 text-center ${
                      selectedType === type.label
                        ? 'border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-500/10 scale-[1.03]'
                        : 'border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-white'
                    }`}
                  >
                    <span className="text-2xl">{type.icon}</span>
                    <span className={`text-xs font-bold tracking-wide ${selectedType === type.label ? 'text-indigo-700' : 'text-slate-600'}`}>
                      {type.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Selection */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <IndianRupee size={16} className="text-indigo-500" /> What's your budget?
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {BUDGET_RANGES.map((b) => (
                  <button
                    key={b.value}
                    onClick={() => { setBudget(b.value); setCustomBudget(''); }}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      budget === b.value && !customBudget
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  placeholder="Or enter exact amount..."
                  value={customBudget}
                  onChange={(e) => { setCustomBudget(e.target.value); setBudget(''); }}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-8 pr-4 py-3.5 text-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-900"
                />
              </div>
            </div>

            {/* Additional Details Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <Users size={16} className="text-indigo-500" /> Guest Count
                </label>
                <input
                  type="number"
                  placeholder="e.g., 150"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <CalendarDays size={16} className="text-indigo-500" /> Preferred Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-900"
                />
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={!selectedType || loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold tracking-wide py-4 rounded-2xl hover:shadow-xl hover:shadow-indigo-500/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 text-lg"
            >
              {loading ? (
                <Loader2 size={22} className="animate-spin" />
              ) : (
                <>
                  <Search size={20} /> Find My Planners
                </>
              )}
            </button>
          </div>
        ) : (
          /* ─── Results Step ─── */
          <div className="p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-emerald-200/50">
                <Sparkles size={14} /> {results.length} Match{results.length !== 1 ? 'es' : ''} Found
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
                Your Perfect Planners
              </h2>
              <p className="text-slate-500 font-medium text-sm">
                Showing planners for <strong className="text-indigo-600">{selectedType}</strong>
                {(budget || customBudget) && (
                  <> within budget <strong className="text-indigo-600">₹{(customBudget || budget).toLocaleString()}</strong></>
                )}
              </p>
            </div>

            {results.length > 0 ? (
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {results.map((mgr) => {
                  const profile = mgr.manager_profile;
                  if (!profile) return null;
                  return (
                    <div key={mgr.id} className="group bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-5 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-200 transition-all duration-300">
                      {/* Thumbnail */}
                      <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100">
                        <img src={profile.image_url} alt={profile.business_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>

                      {/* Info */}
                      <div className="flex-grow min-w-0">
                        <h3 className="font-black text-slate-900 text-lg tracking-tight truncate group-hover:text-indigo-600 transition-colors">
                          {profile.business_name}
                        </h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                          by {mgr.full_name}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {profile.event_types.split(',').map((t, i) => (
                            <span key={i} className="bg-slate-50 text-slate-500 border border-slate-100 text-[10px] uppercase font-bold px-2 py-0.5 rounded-md tracking-wider">
                              {t.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Price & CTA */}
                      <div className="flex flex-col items-end flex-shrink-0 gap-2">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">From</span>
                          <span className="text-lg font-black text-slate-900">₹{profile.min_price.toLocaleString()}</span>
                        </div>
                        <Link
                          to={`/manager/${mgr.id}`}
                          onClick={resetAndClose}
                          className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-indigo-600 transition-colors flex items-center gap-1.5"
                        >
                          View <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-xl font-black text-slate-900 mb-2">No matches found</h3>
                <p className="text-slate-500 font-medium mb-6">Try increasing your budget or changing the event type.</p>
                <button onClick={() => setStep(1)} className="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors">
                  Try Again
                </button>
              </div>
            )}

            {/* Back to edit button */}
            {results.length > 0 && (
              <button onClick={() => setStep(1)} className="w-full mt-6 bg-slate-50 border border-slate-200 text-slate-600 font-bold py-3.5 rounded-2xl hover:bg-slate-100 transition-all text-sm">
                ← Modify Search Criteria
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
