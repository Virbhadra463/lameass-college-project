import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { X, Send, MessageCircle, Loader2 } from 'lucide-react';

export default function ChatWindow({ isOpen, onClose, eventRequest }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);
  const { user } = useContext(AuthContext);

  const otherPerson = user?.role === 'manager'
    ? eventRequest?.client
    : eventRequest?.manager;

  const otherName = user?.role === 'manager'
    ? otherPerson?.full_name
    : (otherPerson?.manager_profile?.business_name || otherPerson?.full_name);

  // Fetch messages
  const fetchMessages = async () => {
    if (!eventRequest) return;
    try {
      const res = await axios.get(`http://localhost:8000/messages?event_request_id=${eventRequest.id}`);
      setMessages(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch messages', err);
      setLoading(false);
    }
  };

  // Initial fetch + polling every 3 seconds
  useEffect(() => {
    if (isOpen && eventRequest) {
      setLoading(true);
      fetchMessages();
      pollRef.current = setInterval(fetchMessages, 3000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [isOpen, eventRequest?.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const res = await axios.post('http://localhost:8000/messages', {
        event_request_id: eventRequest.id,
        sender_id: user.id,
        content: newMessage.trim(),
      });
      setMessages(prev => [...prev, res.data]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" />

      {/* Chat Panel */}
      <div
        className="relative w-full max-w-lg h-[80vh] max-h-[700px] bg-white rounded-[2rem] shadow-2xl shadow-slate-900/20 border border-slate-100 flex flex-col overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─── Header ─── */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white flex-shrink-0">
              <MessageCircle size={20} />
            </div>
            <div className="min-w-0">
              <h3 className="text-white font-black text-lg tracking-tight truncate">
                {otherName || 'Chat'}
              </h3>
              <p className="text-indigo-200 text-xs font-bold truncate">
                {eventRequest?.event_type} • {eventRequest?.date}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-colors flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* ─── Messages Area ─── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-slate-50/50">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 size={28} className="animate-spin text-indigo-400" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4 text-indigo-300">
                <MessageCircle size={28} />
              </div>
              <p className="text-slate-500 font-bold text-sm mb-1">No messages yet</p>
              <p className="text-slate-400 text-xs">Start the conversation by sending a message below.</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.sender_id === user.id;
              return (
                <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
                      isMine
                        ? 'bg-indigo-600 text-white rounded-br-md'
                        : 'bg-white text-slate-800 border border-slate-100 rounded-bl-md'
                    }`}
                  >
                    {!isMine && (
                      <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isMine ? 'text-indigo-200' : 'text-indigo-500'}`}>
                        {msg.sender?.full_name || 'User'}
                      </p>
                    )}
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    <p className={`text-[10px] mt-1.5 ${isMine ? 'text-indigo-200' : 'text-slate-400'} text-right`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ─── Input Area ─── */}
        <form onSubmit={handleSend} className="px-4 py-4 bg-white border-t border-slate-100 flex items-center gap-3 flex-shrink-0">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 focus:bg-white transition-all font-medium text-slate-900 placeholder-slate-400"
            autoFocus
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 flex-shrink-0"
          >
            {sending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
