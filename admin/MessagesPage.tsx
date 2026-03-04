import React, { useEffect, useState } from 'react';
import { authHeaders } from './components/ProtectedRoute';
import { Mail, Trash2, Eye, EyeOff, X, Clock, User } from 'lucide-react';
import { adminToast } from '../lib/adminToast';

interface Message {
     id: number;
     name: string;
     surname: string;
     email: string;
     subject: string;
     message: string;
     is_read: boolean;
     created_at: string;
}

export default function MessagesPage() {
     const [messages, setMessages] = useState<Message[]>([]);
     const [loading, setLoading] = useState(true);
     const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
     const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

     async function fetchMessages() {
          try {
               const res = await fetch('/api/contact', { headers: authHeaders() });
               if (!res.ok) throw new Error(`HTTP ${res.status}`);
               const data = await res.json();
               setMessages(Array.isArray(data) ? data : []);
          } catch {
               adminToast('Mesajlar yüklenemedi', 'error');
          } finally {
               setLoading(false);
          }
     }

     useEffect(() => { fetchMessages(); }, []);

     const toggleRead = async (msg: Message) => {
          try {
               const res = await fetch(`/api/contact/${msg.id}`, {
                    method: 'PATCH',
                    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ is_read: !msg.is_read }),
               });
               if (!res.ok) throw new Error();
               setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, is_read: !m.is_read } : m));
               if (selectedMessage?.id === msg.id) setSelectedMessage({ ...msg, is_read: !msg.is_read });
               adminToast(msg.is_read ? 'Okunmadı olarak işaretlendi' : 'Okundu olarak işaretlendi', 'info');
          } catch {
               adminToast('İşlem başarısız', 'error');
          }
     };

     const deleteMessage = async (id: number) => {
          if (!confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return;
          try {
               const res = await fetch(`/api/contact/${id}`, { method: 'DELETE', headers: authHeaders() });
               if (!res.ok) throw new Error();
               setMessages((prev) => prev.filter((m) => m.id !== id));
               if (selectedMessage?.id === id) setSelectedMessage(null);
               adminToast('Mesaj silindi', 'success');
          } catch {
               adminToast('Silme işlemi başarısız', 'error');
          }
     };

     const formatDate = (dateStr: string) => {
          const d = new Date(dateStr);
          return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
     };

     const filtered = messages.filter((m) => {
          if (filter === 'unread') return !m.is_read;
          if (filter === 'read') return m.is_read;
          return true;
     });

     const unreadCount = messages.filter((m) => !m.is_read).length;

     return (
          <div>
               <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                         <h1 className="text-2xl font-bold text-white">Mesajlar</h1>
                         {unreadCount > 0 && (
                              <span className="bg-amber-500 text-slate-900 text-xs font-bold px-2.5 py-1 rounded-full">
                                   {unreadCount} yeni
                              </span>
                         )}
                    </div>
                    <div className="flex gap-2">
                         {(['all', 'unread', 'read'] as const).map((f) => (
                              <button
                                   key={f}
                                   onClick={() => setFilter(f)}
                                   className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${filter === f
                                             ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                             : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                        }`}
                              >
                                   {f === 'all' ? 'Tümü' : f === 'unread' ? 'Okunmamış' : 'Okunmuş'}
                              </button>
                         ))}
                    </div>
               </div>

               {loading ? (
                    <div className="space-y-3">
                         {[1, 2, 3].map((i) => (
                              <div key={i} className="h-20 bg-slate-800 rounded-xl animate-pulse" />
                         ))}
                    </div>
               ) : filtered.length === 0 ? (
                    <div className="text-center py-16 text-slate-500">
                         <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
                         <p>Henüz mesaj yok</p>
                    </div>
               ) : (
                    <div className="space-y-2">
                         {filtered.map((msg) => (
                              <div
                                   key={msg.id}
                                   onClick={() => {
                                        setSelectedMessage(msg);
                                        if (!msg.is_read) toggleRead(msg);
                                   }}
                                   className={`bg-slate-800 border rounded-xl p-4 cursor-pointer transition-all hover:border-amber-500/30 ${msg.is_read ? 'border-slate-700/50 opacity-70' : 'border-amber-500/20 border-l-4'
                                        }`}
                              >
                                   <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 min-w-0">
                                             <div className={`w-2 h-2 rounded-full flex-shrink-0 ${msg.is_read ? 'bg-slate-600' : 'bg-amber-500'}`} />
                                             <div className="min-w-0">
                                                  <div className="flex items-center gap-2">
                                                       <p className={`text-sm truncate ${msg.is_read ? 'text-slate-400' : 'text-white font-semibold'}`}>
                                                            {msg.name} {msg.surname}
                                                       </p>
                                                       <span className="text-xs text-slate-600">— {msg.email}</span>
                                                  </div>
                                                  <p className="text-xs text-slate-500 truncate mt-0.5">
                                                       {msg.subject ? `${msg.subject}: ` : ''}{msg.message}
                                                  </p>
                                             </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                             <span className="text-xs text-slate-600">{formatDate(msg.created_at)}</span>
                                             <button
                                                  onClick={(e) => { e.stopPropagation(); toggleRead(msg); }}
                                                  className="p-1.5 text-slate-500 hover:text-amber-400 transition-colors"
                                                  title={msg.is_read ? 'Okunmadı işaretle' : 'Okundu işaretle'}
                                             >
                                                  {msg.is_read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                             </button>
                                             <button
                                                  onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id); }}
                                                  className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                                                  title="Sil"
                                             >
                                                  <Trash2 className="w-4 h-4" />
                                             </button>
                                        </div>
                                   </div>
                              </div>
                         ))}
                    </div>
               )}

               {/* Detail Modal */}
               {selectedMessage && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedMessage(null)}>
                         <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-between p-5 border-b border-slate-700">
                                   <h3 className="text-white font-semibold">Mesaj Detayı</h3>
                                   <button onClick={() => setSelectedMessage(null)} className="text-slate-400 hover:text-white">
                                        <X className="w-5 h-5" />
                                   </button>
                              </div>
                              <div className="p-5 space-y-4">
                                   <div className="flex items-center gap-3">
                                        <User className="w-5 h-5 text-amber-400" />
                                        <span className="text-white">{selectedMessage.name} {selectedMessage.surname}</span>
                                   </div>
                                   <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-amber-400" />
                                        <a href={`mailto:${selectedMessage.email}`} className="text-amber-400 hover:underline text-sm">{selectedMessage.email}</a>
                                   </div>
                                   <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-amber-400" />
                                        <span className="text-slate-400 text-sm">{formatDate(selectedMessage.created_at)}</span>
                                   </div>
                                   {selectedMessage.subject && (
                                        <div className="bg-slate-900/50 rounded-lg p-3">
                                             <p className="text-xs text-slate-500 mb-1">Konu</p>
                                             <p className="text-white text-sm">{selectedMessage.subject}</p>
                                        </div>
                                   )}
                                   <div className="bg-slate-900/50 rounded-lg p-3">
                                        <p className="text-xs text-slate-500 mb-1">Mesaj</p>
                                        <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{selectedMessage.message}</p>
                                   </div>
                              </div>
                              <div className="flex justify-end gap-2 p-5 border-t border-slate-700">
                                   <button
                                        onClick={() => toggleRead(selectedMessage)}
                                        className="px-4 py-2 text-sm text-slate-400 hover:text-white bg-slate-700 rounded-lg transition-colors"
                                   >
                                        {selectedMessage.is_read ? 'Okunmadı İşaretle' : 'Okundu İşaretle'}
                                   </button>
                                   <button
                                        onClick={() => deleteMessage(selectedMessage.id)}
                                        className="px-4 py-2 text-sm text-red-400 hover:text-red-300 bg-red-500/10 rounded-lg transition-colors"
                                   >
                                        Sil
                                   </button>
                              </div>
                         </div>
                    </div>
               )}
          </div>
     );
}
