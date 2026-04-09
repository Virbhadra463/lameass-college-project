import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, CalendarDays, Ticket, IndianRupee, User, CheckCircle2, XCircle, Clock, Briefcase, PartyPopper, Mail, MessageCircle } from 'lucide-react';
import ChatWindow from '../components/ChatWindow';

const STATUS_STYLES = {
  Pending: 'bg-amber-50 text-amber-600 border-amber-100',
  Accepted: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  Rejected: 'bg-rose-50 text-rose-600 border-rose-100',
};

const STATUS_ICONS = {
  Pending: <Clock size={14} />,
  Accepted: <CheckCircle2 size={14} />,
  Rejected: <XCircle size={14} />,
};

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const isManager = user?.role === 'manager';

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    axios.get(`http://localhost:8000/event-requests?user_id=${user.id}&role=${user.role}`)
      .then(res => {
        setRequests(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch requests", err);
        setLoading(false);
      });
  }, [user, navigate]);

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      await axios.patch(`http://localhost:8000/event-requests/${requestId}?status=${newStatus}`);
      setRequests(prev =>
        prev.map(r => r.id === requestId ? { ...r, status: newStatus } : r)
      );
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update request status.");
    }
  };

  const openChat = (req) => {
    setActiveChat(req);
    setChatOpen(true);
  };

  if (!user) return null;

  const pendingCount = requests.filter(r => r.status === 'Pending').length;
  const acceptedCount = requests.filter(r => r.status === 'Accepted').length;

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">

      {/* ─── Header Card ─── */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-10 md:p-14 mb-10 shadow-2xl shadow-slate-900/20 flex flex-col md:flex-row items-start md:items-center justify-between text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${isManager ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
              {isManager ? '🏢 Event Manager' : '👤 Client'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-white">{user.full_name}</h1>
          <p className="text-slate-300 font-medium">
            {isManager ? 'Manage incoming event requests from clients.' : 'Track your event booking requests.'}
          </p>
        </div>

        {/* Stats */}
        <div className="mt-8 md:mt-0 relative z-10 flex gap-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 px-6 py-5 rounded-2xl flex items-center gap-4">
            <div className="bg-indigo-500/20 p-3 rounded-xl text-indigo-300">
              <Ticket size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-0.5">Total</p>
              <p className="text-3xl font-black">{requests.length}</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/10 px-6 py-5 rounded-2xl flex items-center gap-4">
            <div className="bg-amber-500/20 p-3 rounded-xl text-amber-300">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-0.5">Pending</p>
              <p className="text-3xl font-black">{pendingCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Section Header ─── */}
      <div className="flex items-center justify-between mb-8 px-2">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          {isManager ? 'Client Requests' : 'My Booking Requests'}
        </h2>
        {acceptedCount > 0 && (
          <span className="text-sm font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full">
            {acceptedCount} Accepted
          </span>
        )}
      </div>
      
      {/* ─── Content ─── */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 font-bold tracking-widest animate-pulse uppercase">Syncing records...</div>
      ) : requests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div key={req.id} className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-[2rem] p-7 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group relative overflow-hidden flex flex-col">
              
              {/* Status Badge */}
              <div className="absolute top-6 right-6">
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border shadow-sm ${STATUS_STYLES[req.status] || STATUS_STYLES.Pending}`}>
                  {STATUS_ICONS[req.status] || STATUS_ICONS.Pending}
                  {req.status}
                </span>
              </div>

              {/* Event Type Icon */}
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-5 text-indigo-500 group-hover:scale-105 transition-transform">
                <PartyPopper size={26} />
              </div>

              {/* Event Type */}
              <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight mb-1 group-hover:text-indigo-600 transition-colors">
                {req.event_type}
              </h3>

              {/* Who is on the other side */}
              {isManager && req.client ? (
                <div className="flex items-center gap-2 mb-4">
                  <User size={14} className="text-slate-400" />
                  <span className="text-slate-500 text-sm font-bold">
                    Client: <span className="text-slate-700">{req.client.full_name}</span>
                  </span>
                </div>
              ) : !isManager && req.manager ? (
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase size={14} className="text-slate-400" />
                  <span className="text-slate-500 text-sm font-bold">
                    Planner: <span className="text-indigo-600">{req.manager.manager_profile?.business_name || req.manager.full_name}</span>
                  </span>
                </div>
              ) : (
                <div className="mb-4"></div>
              )}

              {/* Details Card */}
              <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 space-y-3 mb-5 flex-grow">
                <div className="flex items-center gap-3 text-slate-600">
                  <CalendarDays size={16} className="text-indigo-400 flex-shrink-0" />
                  <span className="font-medium text-sm">{req.date}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <IndianRupee size={16} className="text-emerald-400 flex-shrink-0" />
                  <span className="font-medium text-sm">Budget: ₹{req.budget?.toLocaleString()}</span>
                </div>
                {req.special_requirements && (
                  <div className="flex items-start gap-3 text-slate-600">
                    <Mail size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="font-medium text-sm line-clamp-2">{req.special_requirements}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-auto space-y-3">

                {/* Manager: Accept / Reject (only for Pending) */}
                {isManager && req.status === 'Pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleStatusUpdate(req.id, 'Accepted')}
                      className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 text-sm active:scale-[0.97]"
                    >
                      <CheckCircle2 size={16} /> Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(req.id, 'Rejected')}
                      className="flex-1 bg-white text-rose-600 border-2 border-rose-200 font-bold py-3 rounded-xl hover:bg-rose-50 transition-colors flex items-center justify-center gap-2 text-sm active:scale-[0.97]"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </div>
                )}

                {/* Chat Button — always visible */}
                <button
                  onClick={() => openChat(req)}
                  className="w-full bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold py-3 rounded-xl hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <MessageCircle size={16} /> Chat
                </button>

                {/* Client: view planner profile */}
                {!isManager && req.manager && (
                  <Link
                    to={`/manager/${req.manager_id}`}
                    className="text-center bg-slate-50 border border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-100 transition-colors text-sm block"
                  >
                    View Planner Profile
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] border border-dashed border-slate-300 p-16 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
            <Compass size={32} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">
            {isManager ? 'No requests yet' : 'No upcoming plans'}
          </h3>
          <p className="text-slate-500 font-medium mb-8 text-lg">
            {isManager
              ? 'When clients send you booking requests, they will appear here.'
              : 'Your itinerary is completely empty. Time to discover something new.'}
          </p>
          {!isManager && (
            <button onClick={() => navigate('/')} className="bg-slate-900 text-white font-bold tracking-wide px-8 py-3.5 rounded-full hover:shadow-xl hover:shadow-slate-900/20 hover:-translate-y-1 transition-all">
              Start Exploring
            </button>
          )}
        </div>
      )}

      {/* ─── Chat Window Modal ─── */}
      <ChatWindow
        isOpen={chatOpen}
        onClose={() => { setChatOpen(false); setActiveChat(null); }}
        eventRequest={activeChat}
      />
    </div>
  );
}
